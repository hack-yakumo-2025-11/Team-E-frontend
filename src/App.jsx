import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InitialPage from './Pages/InitialPage';
import MissionPage from './Pages/MissionPage/MissionPage';
import LocationDetailPage from './Pages/LocationDetailPage/LocationDetailPage';
import FunPage from './Pages/FunPage';
// import AchievementsPage from './pages/AchievementsPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/fun" element={<FunPage />} />
          <Route path="/mission-page" element={<MissionPage />} />
          {/* <Route path="/mission/:missionId" element={<MissionPage />} /> */}
          <Route path="/location/:locationId" element={<LocationDetailPage />} />
          {/* //<Route path="/achievements" element={<AchievementsPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;