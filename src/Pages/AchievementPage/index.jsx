import styles from './styles.module.css';
import BottomBar from '../../components/BottomBar';
import { useEffect, useState } from 'react';
import { getAchievements, getUserData } from '../../services/api';
import { Circle, CircleCheckBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AchievementsPage() {
    const [loading, setLoading] = useState(true);
    const [shownList, setShownList] = useState(4);
    const [userData, setUserData] = useState(null);
    const [achievements, setAchievements] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);

            const userDataResponse = await getUserData();
            setUserData(userDataResponse.data);

            const achievementsResponse = await getAchievements();
            setAchievements(achievementsResponse.data);
          } catch (error) {
            console.error("Error fetching mission:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
    }, []);

    if (loading) {
        return (
        <div className="mission-page">
            <div className="loading">Loading achievements...</div>
        </div>
        );
    }

    if (!achievements) {
        return (
        <div className="mission-page">
            <div className="error">No achievements available</div>
        </div>
        );
    }

    return (
        <div className={styles.achievements_page}>
            <div className={styles.achievements_page_title}>
                <span>🏆</span>
                Achievements
            </div>

            <div className={styles.achievements_page_container}>
                {
                    achievements.map((ach, index) => {
                        const list = userData.achievements[ach.name];
                        return (
                            <div 
                                key={ach.name}
                                className={styles.achievements_page_segment}
                                style={{maxHeight: shownList === index ? `${15 + 4 * ach.fullList.length}vh` : '15 vh'}}
                            >
                                <div className={styles.achievements_page_segment_title_reward}>
                                    {ach.fullList.length}
                                </div>
                                <div className={styles.achievements_page_segment_title}>
                                    <img src={ach.image} />
                                    <div>
                                        <span><b>{ach.name}</b></span>
                                        <span>{ach.description}</span>
                                    </div>
                                </div>
                                <div className={styles.achievements_page_segment_progress_block}>
                                    <div className={styles.achievements_page_segment_progress_block_bar}>
                                        <div style={{width: `${list.length / ach.fullList.length * 100}%`}}>
                                            {list.length}/{ach.fullList.length}
                                        </div>
                                    </div>
                                    <button onClick={() => setShownList((val) => {
                                        if (val === index) {
                                            return 4
                                        } else {
                                            return index
                                        }
                                    })}>
                                        Show the list
                                    </button>
                                </div>
                                <div className={styles.achievements_page_segment_list}>
                                    {
                                        shownList === index ?
                                            ach.fullList.map((place) => {
                                                return (
                                                    <span>
                                                        {
                                                            list.includes(place.name) ?
                                                                <CircleCheckBig color='green'/> :
                                                                <Circle/>
                                                        }
                                                        
                                                        <span onClick={() => navigate(`/location/${place.id}`)}>
                                                            {place.name}
                                                        </span>
                                                    </span>
                                                )
                                            }) :
                                        null
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <BottomBar />
        </div>
    );
}

export default AchievementsPage;