#include <Arduino.h>

// 1. Define the Data Structure
// This struct holds a single "frame" of data. All sensor readings in this 
// frame share the exact same microsecond timestamp.
struct SensorFrame {
    int64_t timestamp;  // Microseconds since boot
    
    // IMU Data (Assuming 6-DOF for brevity)
    float accelX, accelY, accelZ;
    float gyroX, gyroY, gyroZ;
    
    // Analog Data
    uint16_t emgValue;
    uint16_t fsrValue;
};

// 2. FreeRTOS Handles
QueueHandle_t dataQueue;
TaskHandle_t producerTaskHandle;
hw_timer_t * hardwareTimer = NULL;

// 3. Hardware Timer Interrupt Service Routine (ISR)
// IRAM_ATTR forces this function into RAM for the fastest possible execution.
// This function does NOT read sensors; it simply wakes up the Producer task.
void IRAM_ATTR onTimer() {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    
    // Unblock the Producer Task
    vTaskNotifyGiveFromISR(producerTaskHandle, &xHigherPriorityTaskWoken);
    
    // Force a context switch if the Producer task has a higher priority
    // than whatever was currently running.
    if (xHigherPriorityTaskWoken) {
        portYIELD_FROM_ISR();
    }
}

// 4. The Producer Task (High Priority)
// Pinned to Core 1 to avoid fighting with ESP32's background Wi-Fi tasks on Core 0.
void producerTask(void * pvParameters) {
    SensorFrame currentFrame;
    
    for (;;) {
        // Suspend task until the hardware timer fires
        ulTaskNotifyTake(pdTRUE, portMAX_DELAY);

        // 1. Grab the timestamp immediately upon waking
        currentFrame.timestamp = esp_timer_get_time();

        // 2. Read Analog sensors (Takes ~10-20 microseconds)
        currentFrame.emgValue = analogRead(34);
        currentFrame.fsrValue = analogRead(35);

        // 3. Read IMU via SPI (Conceptual - replace with your IMU library's SPI read)
        // IMU.readSPI(&currentFrame.accelX, ...);

        // 4. Push the populated frame to the queue. 
        // A timeout of '0' means if the queue is full, it drops the frame 
        // rather than blocking and missing the next timer interrupt.
        xQueueSend(dataQueue, &currentFrame, 0);
    }
}

// 5. The Consumer Task (Lower Priority)
// This task handles the slow, unpredictable work of writing to an SD card or Wi-Fi.
void consumerTask(void * pvParameters) {
    SensorFrame receivedFrame;
    
    for (;;) {
        // Wait indefinitely until a frame is available in the queue
        if (xQueueReceive(dataQueue, &receivedFrame, portMAX_DELAY) == pdPASS) {
            
            // Format and write the data
            // If the SD card takes 50ms to write, this task pauses, but the 
            // Producer task continues firing and filling the queue in the background.
            
            // Example output (Replace with SD.write or MQTT publish)
            Serial.printf("Time: %lld | FSR: %d | EMG: %d | AccelX: %.2f\n", 
                          receivedFrame.timestamp, 
                          receivedFrame.fsrValue, 
                          receivedFrame.emgValue, 
                          receivedFrame.accelX);
        }
    }
}

void setup() {
    Serial.begin(115200);

    // Initialize the queue to hold up to 100 frames (acts as a 1-second buffer at 100 Hz)
    dataQueue = xQueueCreate(100, sizeof(SensorFrame));

    // Create the FreeRTOS tasks
    // Priority 5 (High) for Producer, Priority 2 (Low) for Consumer
    xTaskCreatePinnedToCore(
        producerTask,      // Function to implement the task
        "ProducerTask",    // Name of the task
        4096,              // Stack size in words
        NULL,              // Task input parameter
        5,                 // Priority of the task
        &producerTaskHandle, // Task handle
        1                  // Core where the task should run (Core 1)
    );

    xTaskCreatePinnedToCore(
        consumerTask, 
        "ConsumerTask", 
        8192, 
        NULL, 
        2, 
        NULL, 
        1
    );

    // Configure the Hardware Timer
    // The ESP32 base clock is 80 MHz. A prescaler of 80 gives a 1 MHz timer (1 tick = 1 microsecond).
    hardwareTimer = timerBegin(0, 80, true);
    timerAttachInterrupt(hardwareTimer, &onTimer, true);
    
    // Set the alarm to fire every 10,000 microseconds (100 Hz)
    timerAlarmWrite(hardwareTimer, 10000, true);
    timerAlarmEnable(hardwareTimer);
}

void loop() {
    // The Arduino loop() runs at Priority 1. 
    // Leave this empty and let FreeRTOS handle the tasks.
    vTaskDelete(NULL); 
}
