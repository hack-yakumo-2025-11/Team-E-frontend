import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MissionPage from './Pages/MissionPage/MissionPage';
import LocationDetailPage from './Pages/LocationDetailPage/LocationDetailPage';
// import AchievementsPage from './pages/AchievementsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MissionPage />} />
          {/* <Route path="/mission/:missionId" element={<MissionPage />} /> */}
          <Route path="/location/:locationId" element={<LocationDetailPage />} />
          {/* //<Route path="/achievements" element={<AchievementsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;