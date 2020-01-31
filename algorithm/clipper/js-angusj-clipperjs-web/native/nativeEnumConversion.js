"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../enums");
function polyFillTypeToNative(nativeLib, polyFillType) {
    switch (polyFillType) {
        case enums_1.PolyFillType.EvenOdd:
            return nativeLib.PolyFillType.EvenOdd;
        case enums_1.PolyFillType.NonZero:
            return nativeLib.PolyFillType.NonZero;
        case enums_1.PolyFillType.Positive:
            return nativeLib.PolyFillType.Positive;
        case enums_1.PolyFillType.Negative:
            return nativeLib.PolyFillType.Negative;
        default:
            throw new Error("unknown poly fill type");
    }
}
exports.polyFillTypeToNative = polyFillTypeToNative;
function clipTypeToNative(nativeLib, clipType) {
    switch (clipType) {
        case enums_1.ClipType.Intersection:
            return nativeLib.ClipType.Intersection;
        case enums_1.ClipType.Union:
            return nativeLib.ClipType.Union;
        case enums_1.ClipType.Difference:
            return nativeLib.ClipType.Difference;
        case enums_1.ClipType.Xor:
            return nativeLib.ClipType.Xor;
        default:
            throw new Error("unknown clip type");
    }
}
exports.clipTypeToNative = clipTypeToNative;
function polyTypeToNative(nativeLib, polyType) {
    switch (polyType) {
        case enums_1.PolyType.Subject:
            return nativeLib.PolyType.Subject;
        case enums_1.PolyType.Clip:
            return nativeLib.PolyType.Clip;
        default:
            throw new Error("unknown poly type");
    }
}
exports.polyTypeToNative = polyTypeToNative;
function joinTypeToNative(nativeLib, joinType) {
    switch (joinType) {
        case enums_1.JoinType.Square:
            return nativeLib.JoinType.Square;
        case enums_1.JoinType.Round:
            return nativeLib.JoinType.Round;
        case enums_1.JoinType.Miter:
            return nativeLib.JoinType.Miter;
        default:
            throw new Error("unknown join type");
    }
}
exports.joinTypeToNative = joinTypeToNative;
function endTypeToNative(nativeLib, endType) {
    switch (endType) {
        case enums_1.EndType.ClosedPolygon:
            return nativeLib.EndType.ClosedPolygon;
        case enums_1.EndType.ClosedLine:
            return nativeLib.EndType.ClosedLine;
        case enums_1.EndType.OpenButt:
            return nativeLib.EndType.OpenButt;
        case enums_1.EndType.OpenSquare:
            return nativeLib.EndType.OpenSquare;
        case enums_1.EndType.OpenRound:
            return nativeLib.EndType.OpenRound;
        default:
            throw new Error("unknown end type");
    }
}
exports.endTypeToNative = endTypeToNative;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF0aXZlRW51bUNvbnZlcnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbmF0aXZlL25hdGl2ZUVudW1Db252ZXJzaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0NBQStFO0FBVS9FLFNBQWdCLG9CQUFvQixDQUNsQyxTQUFtQyxFQUNuQyxZQUEwQjtJQUUxQixRQUFRLFlBQVksRUFBRTtRQUNwQixLQUFLLG9CQUFZLENBQUMsT0FBTztZQUN2QixPQUFPLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDO1FBQ3hDLEtBQUssb0JBQVksQ0FBQyxPQUFPO1lBQ3ZCLE9BQU8sU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUM7UUFDeEMsS0FBSyxvQkFBWSxDQUFDLFFBQVE7WUFDeEIsT0FBTyxTQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztRQUN6QyxLQUFLLG9CQUFZLENBQUMsUUFBUTtZQUN4QixPQUFPLFNBQVMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDO1FBQ3pDO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQzdDO0FBQ0gsQ0FBQztBQWhCRCxvREFnQkM7QUFFRCxTQUFnQixnQkFBZ0IsQ0FDOUIsU0FBbUMsRUFDbkMsUUFBa0I7SUFFbEIsUUFBUSxRQUFRLEVBQUU7UUFDaEIsS0FBSyxnQkFBUSxDQUFDLFlBQVk7WUFDeEIsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQztRQUN6QyxLQUFLLGdCQUFRLENBQUMsS0FBSztZQUNqQixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ2xDLEtBQUssZ0JBQVEsQ0FBQyxVQUFVO1lBQ3RCLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDdkMsS0FBSyxnQkFBUSxDQUFDLEdBQUc7WUFDZixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO1FBQ2hDO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0gsQ0FBQztBQWhCRCw0Q0FnQkM7QUFFRCxTQUFnQixnQkFBZ0IsQ0FDOUIsU0FBbUMsRUFDbkMsUUFBa0I7SUFFbEIsUUFBUSxRQUFRLEVBQUU7UUFDaEIsS0FBSyxnQkFBUSxDQUFDLE9BQU87WUFDbkIsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUNwQyxLQUFLLGdCQUFRLENBQUMsSUFBSTtZQUNoQixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQ2pDO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0gsQ0FBQztBQVpELDRDQVlDO0FBRUQsU0FBZ0IsZ0JBQWdCLENBQzlCLFNBQW1DLEVBQ25DLFFBQWtCO0lBRWxCLFFBQVEsUUFBUSxFQUFFO1FBQ2hCLEtBQUssZ0JBQVEsQ0FBQyxNQUFNO1lBQ2xCLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDbkMsS0FBSyxnQkFBUSxDQUFDLEtBQUs7WUFDakIsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUNsQyxLQUFLLGdCQUFRLENBQUMsS0FBSztZQUNqQixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ2xDO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0gsQ0FBQztBQWRELDRDQWNDO0FBRUQsU0FBZ0IsZUFBZSxDQUM3QixTQUFtQyxFQUNuQyxPQUFnQjtJQUVoQixRQUFRLE9BQU8sRUFBRTtRQUNmLEtBQUssZUFBTyxDQUFDLGFBQWE7WUFDeEIsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUN6QyxLQUFLLGVBQU8sQ0FBQyxVQUFVO1lBQ3JCLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDdEMsS0FBSyxlQUFPLENBQUMsUUFBUTtZQUNuQixPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ3BDLEtBQUssZUFBTyxDQUFDLFVBQVU7WUFDckIsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUN0QyxLQUFLLGVBQU8sQ0FBQyxTQUFTO1lBQ3BCLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDckM7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDdkM7QUFDSCxDQUFDO0FBbEJELDBDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENsaXBUeXBlLCBFbmRUeXBlLCBKb2luVHlwZSwgUG9seUZpbGxUeXBlLCBQb2x5VHlwZSB9IGZyb20gXCIuLi9lbnVtc1wiO1xyXG5pbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9OYXRpdmVDbGlwcGVyTGliSW5zdGFuY2VcIjtcclxuaW1wb3J0IHtcclxuICBOYXRpdmVDbGlwVHlwZSxcclxuICBOYXRpdmVFbmRUeXBlLFxyXG4gIE5hdGl2ZUpvaW5UeXBlLFxyXG4gIE5hdGl2ZVBvbHlGaWxsVHlwZSxcclxuICBOYXRpdmVQb2x5VHlwZVxyXG59IGZyb20gXCIuL25hdGl2ZUVudW1zXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcG9seUZpbGxUeXBlVG9OYXRpdmUoXHJcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXHJcbiAgcG9seUZpbGxUeXBlOiBQb2x5RmlsbFR5cGVcclxuKTogTmF0aXZlUG9seUZpbGxUeXBlIHtcclxuICBzd2l0Y2ggKHBvbHlGaWxsVHlwZSkge1xyXG4gICAgY2FzZSBQb2x5RmlsbFR5cGUuRXZlbk9kZDpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5Qb2x5RmlsbFR5cGUuRXZlbk9kZDtcclxuICAgIGNhc2UgUG9seUZpbGxUeXBlLk5vblplcm86XHJcbiAgICAgIHJldHVybiBuYXRpdmVMaWIuUG9seUZpbGxUeXBlLk5vblplcm87XHJcbiAgICBjYXNlIFBvbHlGaWxsVHlwZS5Qb3NpdGl2ZTpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5Qb2x5RmlsbFR5cGUuUG9zaXRpdmU7XHJcbiAgICBjYXNlIFBvbHlGaWxsVHlwZS5OZWdhdGl2ZTpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5Qb2x5RmlsbFR5cGUuTmVnYXRpdmU7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIHBvbHkgZmlsbCB0eXBlXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNsaXBUeXBlVG9OYXRpdmUoXHJcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXHJcbiAgY2xpcFR5cGU6IENsaXBUeXBlXHJcbik6IE5hdGl2ZUNsaXBUeXBlIHtcclxuICBzd2l0Y2ggKGNsaXBUeXBlKSB7XHJcbiAgICBjYXNlIENsaXBUeXBlLkludGVyc2VjdGlvbjpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5DbGlwVHlwZS5JbnRlcnNlY3Rpb247XHJcbiAgICBjYXNlIENsaXBUeXBlLlVuaW9uOlxyXG4gICAgICByZXR1cm4gbmF0aXZlTGliLkNsaXBUeXBlLlVuaW9uO1xyXG4gICAgY2FzZSBDbGlwVHlwZS5EaWZmZXJlbmNlOlxyXG4gICAgICByZXR1cm4gbmF0aXZlTGliLkNsaXBUeXBlLkRpZmZlcmVuY2U7XHJcbiAgICBjYXNlIENsaXBUeXBlLlhvcjpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5DbGlwVHlwZS5Yb3I7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGNsaXAgdHlwZVwiKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwb2x5VHlwZVRvTmF0aXZlKFxyXG4gIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxyXG4gIHBvbHlUeXBlOiBQb2x5VHlwZVxyXG4pOiBOYXRpdmVQb2x5VHlwZSB7XHJcbiAgc3dpdGNoIChwb2x5VHlwZSkge1xyXG4gICAgY2FzZSBQb2x5VHlwZS5TdWJqZWN0OlxyXG4gICAgICByZXR1cm4gbmF0aXZlTGliLlBvbHlUeXBlLlN1YmplY3Q7XHJcbiAgICBjYXNlIFBvbHlUeXBlLkNsaXA6XHJcbiAgICAgIHJldHVybiBuYXRpdmVMaWIuUG9seVR5cGUuQ2xpcDtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gcG9seSB0eXBlXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGpvaW5UeXBlVG9OYXRpdmUoXHJcbiAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXHJcbiAgam9pblR5cGU6IEpvaW5UeXBlXHJcbik6IE5hdGl2ZUpvaW5UeXBlIHtcclxuICBzd2l0Y2ggKGpvaW5UeXBlKSB7XHJcbiAgICBjYXNlIEpvaW5UeXBlLlNxdWFyZTpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5Kb2luVHlwZS5TcXVhcmU7XHJcbiAgICBjYXNlIEpvaW5UeXBlLlJvdW5kOlxyXG4gICAgICByZXR1cm4gbmF0aXZlTGliLkpvaW5UeXBlLlJvdW5kO1xyXG4gICAgY2FzZSBKb2luVHlwZS5NaXRlcjpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5Kb2luVHlwZS5NaXRlcjtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInVua25vd24gam9pbiB0eXBlXCIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVuZFR5cGVUb05hdGl2ZShcclxuICBuYXRpdmVMaWI6IE5hdGl2ZUNsaXBwZXJMaWJJbnN0YW5jZSxcclxuICBlbmRUeXBlOiBFbmRUeXBlXHJcbik6IE5hdGl2ZUVuZFR5cGUge1xyXG4gIHN3aXRjaCAoZW5kVHlwZSkge1xyXG4gICAgY2FzZSBFbmRUeXBlLkNsb3NlZFBvbHlnb246XHJcbiAgICAgIHJldHVybiBuYXRpdmVMaWIuRW5kVHlwZS5DbG9zZWRQb2x5Z29uO1xyXG4gICAgY2FzZSBFbmRUeXBlLkNsb3NlZExpbmU6XHJcbiAgICAgIHJldHVybiBuYXRpdmVMaWIuRW5kVHlwZS5DbG9zZWRMaW5lO1xyXG4gICAgY2FzZSBFbmRUeXBlLk9wZW5CdXR0OlxyXG4gICAgICByZXR1cm4gbmF0aXZlTGliLkVuZFR5cGUuT3BlbkJ1dHQ7XHJcbiAgICBjYXNlIEVuZFR5cGUuT3BlblNxdWFyZTpcclxuICAgICAgcmV0dXJuIG5hdGl2ZUxpYi5FbmRUeXBlLk9wZW5TcXVhcmU7XHJcbiAgICBjYXNlIEVuZFR5cGUuT3BlblJvdW5kOlxyXG4gICAgICByZXR1cm4gbmF0aXZlTGliLkVuZFR5cGUuT3BlblJvdW5kO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5rbm93biBlbmQgdHlwZVwiKTtcclxuICB9XHJcbn1cclxuIl19