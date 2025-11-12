import './OriginalAppPage.css';
import FreshStart from '../../assets/images/FreshStart.png';
import OpenScan from '../../assets/images/OpenScan.png';
import { useState } from 'react';

function OriginalAppPage() {
  const [backImage, setBackImage] = useState(false);

  return (
    <div className="main-screen">
        <img 
          src={backImage ? OpenScan : FreshStart} 
          className='main-screen-img'
        />
        <button 
          className='main-screen-open-scan-button' 
          onClick={() => setBackImage((val) => 1 - val)}
          style={{zIndex: !backImage * 3}}
        />
        <button 
          className='main-screen-click-scan-button' 
          onClick={() => console.log('-')}
          style={{zIndex: backImage * 3}}
        />
        <button 
          className='main-screen-close-scan-button' 
          onClick={() => setBackImage((val) => 1 - val)}
          style={{zIndex: backImage * 3}}
        />
    </div>
  );
}

export default OriginalAppPage;