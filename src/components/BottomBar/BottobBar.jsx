import './BottomBar.css';
import { House } from 'lucide-react';
import { Map } from 'lucide-react';
import { Gift } from 'lucide-react';
import { Ticket } from 'lucide-react';
import { ScanBarcode } from 'lucide-react';

function BottomBar() {

  return (
    <div className="bottom-bar">
        <div className="bottom-bar-element">
           <House width={30}height={30}color='#0047AB'/>
        </div>
        <div className="bottom-bar-element">
            <Map width={30}height={30}color='#0047AB'/>
        </div>
        <div className="bottom-bar-element">
            <Gift width={30}height={30}color='#0047AB'/>
        </div>
        <div className="bottom-bar-element">
            <Ticket width={30}height={30}color='#0047AB'/>
        </div>
        <div className="bottom-bar-element">
            <ScanBarcode width={30}height={30}color='#0047AB'/>
        </div>  
      </div>
  );
}

export default BottomBar;
