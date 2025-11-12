import styles from './styles.module.css';
import BottomBar from '../../components/BottomBar';
import { useEffect, useState } from 'react';
import { getAchievements } from '../../services/api';
import { Circle, CircleCheckBig } from 'lucide-react';
import AdventurerBadge from '../../assets/images/AdventurerBadge.png';
import CollectorBadge from '../../assets/images/CollectorBadge.png';
import FoodieBadge from '../../assets/images/FoodieBadge.png';

const dummyAchievements = [
    {
        name: 'Foodie',
        image: FoodieBadge,
        description: 'A journey to find the perfect food spot',
        list: [
            'Yugyo-an Tankuma Kita-mise',
            'TORIMIKURA YATAI'
        ],
        fullList: [
            'Yugyo-an Tankuma Kita-mise',
            'Seafood Buffet Iroha',
            'Flowers, Food and Cream Soda Nagisa Restaurant',
            'TORIMIKURA YATAI'
        ]
    },
    {
        name: 'Collector',
        image: CollectorBadge,
        description: 'It is OK to want everything they sell',
        list: [
            'GIANTS STORE BALLPARK TOKYO',
        ],
        fullList: [
            'GIANTS STORE BALLPARK TOKYO',
            'JUMP SHOP',
            'GLOBAL WORK',
            'UNIQLO',
            'ABC-MART'
        ]
    },
    {
        name: 'Adventurer',
        image: AdventurerBadge,
        description: 'What else can you try here?',
        list: [
            'Hero Action Show',
            'Indoor Kids` Playground ASOBono!',
            'Space Travelium TeNQ',
            'Gallery AaMo',
            'Table Tennis Space TaKuSuRu'
        ],
        fullList: [
            'Hero Action Show',
            'Indoor Kids` Playground ASOBono!',
            'Space Travelium TeNQ',
            'Tokyo Dome Roller Skate Arena',
            'Gallery AaMo',
            'Table Tennis Space TaKuSuRu'
        ]
    }
]

function AchievementsPage() {
    const [loading, setLoading] = useState(true);
    const [shownList, setShownList] = useState(4);
    const [achievements, setAchievements] = useState(dummyAchievements);

    useEffect(() => {
        const fetchMission = async () => {
          try {
            setLoading(true);
            const response = await getAchievements(0);
            setAchievements(response.data);
          } catch (error) {
            console.error("Error fetching mission:", error);
            console.log("Using dummy data with completed tasks:", dummyAchievements);
            setAchievements(dummyAchievements);
          } finally {
            setLoading(false);
          }
        };
    
        fetchMission();
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
            <div></div>

            <div className={styles.achievements_page_container}>
                {
                    achievements.map((ach, index) => {
                        return (
                            <div 
                                id={ach.name} 
                                className={styles.achievements_page_segment}
                                style={{height: shownList === index ? `${12 + 3 * ach.fullList.length}vh` : '12 vh'}}
                            >
                                <div className={styles.achievements_page_segment_title}>
                                    <img src={ach.image} />
                                    <div>
                                        <span><b>{ach.name}</b></span>
                                        <span>{ach.description}</span>
                                    </div>
                                </div>
                                <div className={styles.achievements_page_segment_progress_block}>
                                    <span>
                                        Progress {ach.list.length}/{ach.fullList.length}
                                    </span>
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
                                                            ach.list.includes(place) ?
                                                                <CircleCheckBig /> :
                                                                <Circle />
                                                        }
                                                        
                                                        {place}
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