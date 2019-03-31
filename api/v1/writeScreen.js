import { buildThreejsScreen } from './buildThreejsScreen';

export const writeScreen = ({ path }, ...shapes) => {
    
    const pathElements = path.split('/');
    const target = pathElements[0];
    const targetDiv = pathElements[1];
    const shapeID = pathElements[2];
    
    //Add a viewer to the div if there isn't one already
    if(typeof document.getElementById(targetDiv).threeScreen == 'undefined'){
        buildThreejsScreen(targetDiv);
    }
    
    //Write to it
    document.getElementById(targetDiv).threeScreen.writeScreen({id: shapeID}, ...shapes);    
}