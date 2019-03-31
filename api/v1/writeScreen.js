import { buildThreejsScreen } from './buildThreejsScreen';

export const writeScreen = ({ path }, ...shapes) => {
    
    //Parse the path
    var [target , targetDiv, shapeID ]  = path.split('/');
    
    //Add a viewer to the path if there isn't one already
    if(typeof document.getElementById(targetDiv).threeScreen == 'undefined'){
        buildThreejsScreen(targetDiv);
    }
    
    //Write to it
    document.getElementById(targetDiv).threeScreen.writeScreen({id: shapeID}, ...shapes);    
}