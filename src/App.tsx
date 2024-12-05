import { useEffect, useRef, useState } from 'react'
import './App.css'


function App() {
  const [time, setTime] = useState(0); // 计时器当前时间(秒)
  const [targetTime, setTargetTime] = useState(5); // 目标时间(秒) 
  const [isRunning, setIsRunning] = useState(false); // 计时器运行状态
  const [logs, setLogs] = useState<string[]>(() => {
    // 初始化时从localStorage读取日志
    const savedLogs = localStorage.getItem('timerLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  }); // 计时器日志
  const [isLoop, setIsLoop] = useState(false); // 是否循环
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('zh-CN'));
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('zh-CN'));

  // 初始化音频
  useEffect(() => {
    const audio = new Audio('/alarm-clock-90867.mp3'); // 替换为实际音频路径
    audioRef.current = audio;
  }, []);

  // 计时器逻辑
  useEffect(() => {
    let timer: number | null = null;
    
    if (isRunning) {
      // 记录启动日志
      const startLog = `计时器启动 - ${new Date().toLocaleString()}`;
      setLogs(prev => {
        const newLogs = [...prev, startLog];
        // 保存日志到localStorage
        localStorage.setItem('timerLogs', JSON.stringify(newLogs));
        return newLogs;
      });
      
      timer = window.setInterval(() => {
        setTime(prevTime => {
          if (prevTime >= targetTime) {
            // 播放提示音
            audioRef.current?.play();
            setTimeout(() => {
              if(! audioRef.current) {
                return;
              }
              audioRef.current!.currentTime = 0;
              audioRef.current?.pause();
            }, 1000);
            
            if (isLoop) {
              // 循环模式：重置计时
              return 0;
            } else {
              // 非循环模式：停止计时
              setIsRunning(false);
              return targetTime;
            }
          }
          return prevTime + 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isRunning, targetTime, isLoop]);

  // 开始/暂停计时
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  // 重置计时器
  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  // 切换循环模式
  const toggleLoop = () => {
    setIsLoop(prev => !prev);
  };

  // 添加新的useEffect来更新日期和时间
  useEffect(() => {
    const dateTimer = setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString('zh-CN'));
      setCurrentTime(new Date().toLocaleTimeString('zh-CN'));
    }, 1000); // 每秒更新一次

    return () => clearInterval(dateTimer);
  }, []);

  return (
    
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 添加日期和时间显示 */}
        <div className="text-sm text-gray-500 mb-2 text-right">
          {currentDate} {currentTime}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">计时器</h1>
        
        {/* 主要功能区 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="text-6xl font-mono mb-8">
            {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={toggleTimer}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? '暂停' : '开始'}
            </button>
            
            <button
              onClick={resetTimer}
              className="px-6 py-2 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white"
            >
              重置
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isLoop}
                onChange={toggleLoop}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2 text-gray-700">循环模式</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-gray-700 flex items-center">
              目標時間（秒）：
              <input
                type="number"
                value={targetTime}
                onChange={(e) => setTargetTime(Math.max(1, parseInt(e.target.value) || 0))}
                className="ml-2 w-20 px-2 py-1 border rounded"
                min="1"
              />
            </label>
          </div>
        </div>

        {/* 日志区域 - 调整为次要视觉元素 */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h2 className="text-base font-medium text-gray-500 mb-3">运行日志</h2>
          <div className="h-32 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-xs text-gray-400 mb-1">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
