import { buildConvexHull } from '@jsxcad/algorithm-shape';
import { CSG } from './CSG';
import { toPoints } from '@jsxcad/algorithm-paths';


export const hull = (...geometries) => {
    
    var allPoints = [];
    for (const geometry of geometries) {
        allPoints = allPoints.concat(geometry.toPoints());
    }
    
    return CSG.fromPolygons(buildConvexHull({}, allPoints))
}
