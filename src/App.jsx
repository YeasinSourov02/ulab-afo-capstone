import React,{useState} from 'react';
import {LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid,ResponsiveContainer,Legend} from 'recharts';
const API='http://127.0.0.1:8000';
const classes=['Healthy','Drop-foot','Hemiplegic','Spastic Diplegic','Parkinsonian'];
export default function App(){
 const [label,setLabel]=useState('Healthy'),[noise,setNoise]=useState(.04),[rows,setRows]=useState([]),[result,setResult]=useState(null),[busy,setBusy]=useState(false),[msg,setMsg]=useState('');
 async function generate(){setBusy(true);setMsg('Generating synthetic session…');setResult(null);
  try{let r=await fetch(`${API}/api/demo?label=${encodeURIComponent(label)}&noise=${noise}&seed=${Date.now()%100000}`);let d=await r.json();if(!r.ok)throw Error(d.detail||'Could not generate');setRows(d.rows);setMsg(`Generated ${d.rows.length} synthetic samples. Label is for demonstration only.`)}
  catch(e){setMsg(e.message)}finally{setBusy(false)}}
 async function analyze(){setBusy(true);setMsg('Analyzing…');try{
  const r=await fetch(`${API}/api/analyze-demo?label=${encodeURIComponent(label)}&noise=${noise}&seed=${Date.now()%100000}`,{method:'POST'});const d=await r.json();if(!r.ok)throw Error(d.detail||'Analysis failed');setResult(d);setMsg('Demo analysis completed.');}
  catch(e){setMsg(e.message)}finally{setBusy(false)}}
 async function upload(e){const f=e.target.files?.[0];if(!f)return;setBusy(true);setResult(null);try{const fd=new FormData();fd.append('file',f);const r=await fetch(`${API}/api/analyze`,{method:'POST',body:fd});const d=await r.json();if(!r.ok)throw Error(d.detail||'Upload failed');setResult(d);setMsg('CSV analyzed. Verify its source and channel units.')}catch(err){setMsg(err.message)}finally{setBusy(false);e.target.value=''}}
 const chart=rows.slice(0,500).map((r,i)=>({i,...r}));
 return <div className="shell"><aside><div className="brand">◈ <span>SMART AFO</span></div><p className="nav active">Overview</p><p className="nav">Session analysis</p><p className="nav">Research demo</p><div className="sideNote">CAPSTONE SOFTWARE<br/>Synthetic-data mode</div></aside>
 <main><header><div><small>RESEARCH PROTOTYPE</small><h1>Gait analysis dashboard</h1><p>Sensor-fused gait classification • Explainable AI</p></div><span className="pill">● Demo mode</span></header>
 <div className="warning">Research demonstration only — outputs are not patient diagnoses. Synthetic data cannot establish clinical accuracy.</div>
 <section className="stats"><div className="stat"><small>Target classes</small><strong>05</strong><span>Healthy + 4 gait classes</span></div><div className="stat"><small>Sensor channels</small><strong>18</strong><span>6 IMU left/right + 2 EMG + 4 FSR (18 total)</span></div><div className="stat"><small>Model</small><strong>Random Forest</strong><span>Demo baseline</span></div></section>
 <section className="panel"><div className="panelHead"><div><h2>Run an analysis</h2><p>Generate invented sensor signals or upload a compatible CSV.</p></div></div>
 <div className="controls"><label>Demo class<select value={label} onChange={e=>setLabel(e.target.value)}>{classes.map(c=><option key={c}>{c}</option>)}</select></label><label>Noise level <input type="range" min="0" max=".2" step=".01" value={noise} onChange={e=>setNoise(Number(e.target.value))}/><small>{noise.toFixed(2)}</small></label>
 <button disabled={busy} onClick={generate}>Generate signals</button><button disabled={busy} onClick={analyze} className="primary">Analyze demo</button><label className="upload">Upload CSV<input type="file" accept=".csv" onChange={upload}/></label></div><p className="message">{msg}</p></section>
 {rows.length>0&&<section className="panel"><h2>Sensor preview</h2><p>First 500 samples of generated session</p><ResponsiveContainer width="100%" height={280}><LineChart data={chart}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="i"/><YAxis/><Tooltip/><Legend/><Line dot={false} dataKey="imu_left_ax" stroke="#2774a5"/><Line dot={false} dataKey="imu_right_ax" stroke="#e18b43"/><Line dot={false} dataKey="emg_ch1" stroke="#38936b"/></LineChart></ResponsiveContainer></section>}
 {result&&<section className="results"><div className="panel prediction"><small>DEMO MODEL OUTPUT</small><h2>{result.prediction}</h2><p>Predicted class — not a diagnosis</p><div className="gsi"><span>Demonstration GSI</span><strong>{result.gsi_demo_percent??'—'}{result.gsi_demo_percent!==null?'%':''}</strong></div><p className="quality">{result.quality}</p></div>
 <div className="panel"><h2>Class probabilities</h2>{result.probabilities?.map(p=><div className="prob" key={p.class}><div><span>{p.class}</span><b>{(p.probability*100).toFixed(1)}%</b></div><div className="bar"><i style={{width:`${p.probability*100}%`}}/></div></div>)}</div>
 <div className="panel"><h2>Model feature importance</h2><p>{result.explanation_type}</p>{result.top_features?.map(f=><div className="feature" key={f.feature}><span>{f.feature}</span><b>{f.importance.toFixed(4)}</b></div>)}</div>
 <div className="notice">{result.notice}</div></section>}
 <footer>Smart AFO • Capstone development build • No real patient data</footer></main></div>
}
