export const clearScreen = ({ path }) => {
    //Parse the path
    var [target , targetDiv, shapeID ]  = path.split('/');
    
    //Clear screen if it exists at path
    var threeInstance = document.getElementById(targetDiv).threeScreen;
    
    //Add a viewer to the path if there isn't one already
    if(typeof threeInstance != 'undefined'){
        if(shapeID == '*'){
            threeInstance.clearScreenAll();
        }
        else{
            threeInstance.clearScreenById(shapeID);
        }
    }
}