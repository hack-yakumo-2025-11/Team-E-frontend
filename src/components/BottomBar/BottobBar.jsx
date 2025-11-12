import './BottomBar.css';
import bottomBarImage from '../../assets/images/bottom_bar.png';

function BottomBar() {

    const handleCenterButtonClick = () => {
    console.log('Center button clicked');
};

  return (
    <div className="bottom-bar">
      <img src={bottomBarImage} alt="Bottom Bar" />
      <button 
        className="center-button" 
        onClick={handleCenterButtonClick}
      >
      </button>
    </div>
  );
}

export default BottomBar;
