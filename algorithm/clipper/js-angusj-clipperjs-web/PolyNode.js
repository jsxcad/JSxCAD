"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathToNativePath_1 = require("./native/PathToNativePath");
/**
 * PolyNodes are encapsulated within a PolyTree container, and together provide a data structure representing the parent-child relationships of polygon
 * contours returned by clipping/ofsetting methods.
 *
 * A PolyNode object represents a single polygon. It's isHole property indicates whether it's an outer or a hole. PolyNodes may own any number of PolyNode
 * children (childs), where children of outer polygons are holes, and children of holes are (nested) outer polygons.
 */
var PolyNode = /** @class */ (function () {
    function PolyNode() {
        this._childs = [];
        this._contour = [];
        this._isOpen = false;
        this._index = 0;
    }
    Object.defineProperty(PolyNode.prototype, "parent", {
        /**
         * Returns the parent PolyNode.
         *
         * The PolyTree object (which is also a PolyNode) does not have a parent and will return undefined.
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "childs", {
        /**
         * A read-only list of PolyNode.
         * Outer PolyNode childs contain hole PolyNodes, and hole PolyNode childs contain nested outer PolyNodes.
         */
        get: function () {
            return this._childs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "contour", {
        /**
         * Returns a path list which contains any number of vertices.
         */
        get: function () {
            return this._contour;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "isOpen", {
        /**
         * Returns true when the PolyNode's Contour results from a clipping operation on an open contour (path). Only top-level PolyNodes can contain open contours.
         */
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "index", {
        /**
         * Index in the parent's child list, or 0 if no parent.
         */
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PolyNode.prototype, "isHole", {
        /**
         * Returns true when the PolyNode's polygon (Contour) is a hole.
         *
         * Children of outer polygons are always holes, and children of holes are always (nested) outer polygons.
         * The isHole property of a PolyTree object is undefined but its children are always top-level outer polygons.
         *
         * @return {boolean}
         */
        get: function () {
            if (this._isHole === undefined) {
                var result = true;
                var node = this._parent;
                while (node !== undefined) {
                    result = !result;
                    node = node._parent;
                }
                this._isHole = result;
            }
            return this._isHole;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The returned PolyNode will be the first child if any, otherwise the next sibling, otherwise the next sibling of the Parent etc.
     *
     * A PolyTree can be traversed very easily by calling GetFirst() followed by GetNext() in a loop until the returned object is undefined.
     *
     * @return {PolyNode | undefined}
     */
    PolyNode.prototype.getNext = function () {
        if (this._childs.length > 0) {
            return this._childs[0];
        }
        else {
            return this.getNextSiblingUp();
        }
    };
    PolyNode.prototype.getNextSiblingUp = function () {
        if (this._parent === undefined) {
            return undefined;
        }
        else if (this._index === this._parent._childs.length - 1) {
            //noinspection TailRecursionJS
            return this._parent.getNextSiblingUp();
        }
        else {
            return this._parent._childs[this._index + 1];
        }
    };
    PolyNode.fillFromNativePolyNode = function (pn, nativeLib, nativePolyNode, parent, childIndex, freeNativePolyNode) {
        pn._parent = parent;
        var childs = nativePolyNode.childs;
        for (var i = 0, max = childs.size(); i < max; i++) {
            var newChild = PolyNode.fromNativePolyNode(nativeLib, childs.get(i), pn, i, freeNativePolyNode);
            pn._childs.push(newChild);
        }
        // do we need to clear the object ourselves? for now let's assume so (seems to work)
        pn._contour = PathToNativePath_1.nativePathToPath(nativeLib, nativePolyNode.contour, true);
        pn._isOpen = nativePolyNode.isOpen();
        pn._index = childIndex;
        if (freeNativePolyNode) {
            nativePolyNode.delete();
        }
    };
    PolyNode.fromNativePolyNode = function (nativeLib, nativePolyNode, parent, childIndex, freeNativePolyNode) {
        var pn = new PolyNode();
        PolyNode.fillFromNativePolyNode(pn, nativeLib, nativePolyNode, parent, childIndex, freeNativePolyNode);
        return pn;
    };
    return PolyNode;
}());
exports.PolyNode = PolyNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9seU5vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUG9seU5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw4REFBNkQ7QUFHN0Q7Ozs7OztHQU1HO0FBQ0g7SUE4RkU7UUFsRlUsWUFBTyxHQUFlLEVBQUUsQ0FBQztRQVN6QixhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQVE1QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBUXpCLFdBQU0sR0FBVyxDQUFDLENBQUM7SUF5REosQ0FBQztJQXRGMUIsc0JBQUksNEJBQU07UUFMVjs7OztXQUlHO2FBQ0g7WUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdEIsQ0FBQzs7O09BQUE7SUFPRCxzQkFBSSw0QkFBTTtRQUpWOzs7V0FHRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksNkJBQU87UUFIWDs7V0FFRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksNEJBQU07UUFIVjs7V0FFRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBTUQsc0JBQUksMkJBQUs7UUFIVDs7V0FFRzthQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBV0Qsc0JBQUksNEJBQU07UUFSVjs7Ozs7OztXQU9HO2FBQ0g7WUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO2dCQUM5QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUksSUFBSSxHQUF5QixJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxPQUFPLElBQUksS0FBSyxTQUFTLEVBQUU7b0JBQ3pCLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQztvQkFDakIsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7aUJBQ3JCO2dCQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2FBQ3ZCO1lBRUQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsMEJBQU8sR0FBUDtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFFUyxtQ0FBZ0IsR0FBMUI7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1lBQzlCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDMUQsOEJBQThCO1lBQzlCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3hDO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBSWdCLCtCQUFzQixHQUF2QyxVQUNFLEVBQVksRUFDWixTQUFtQyxFQUNuQyxjQUE4QixFQUM5QixNQUE0QixFQUM1QixVQUFrQixFQUNsQixrQkFBMkI7UUFFM0IsRUFBRSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFFcEIsSUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDakQsSUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGtCQUFrQixDQUMxQyxTQUFTLEVBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFDYixFQUFFLEVBQ0YsQ0FBQyxFQUNELGtCQUFrQixDQUNuQixDQUFDO1lBQ0YsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDM0I7UUFFRCxvRkFBb0Y7UUFDcEYsRUFBRSxDQUFDLFFBQVEsR0FBRyxtQ0FBZ0IsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RSxFQUFFLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNyQyxFQUFFLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUV2QixJQUFJLGtCQUFrQixFQUFFO1lBQ3RCLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFZ0IsMkJBQWtCLEdBQW5DLFVBQ0UsU0FBbUMsRUFDbkMsY0FBOEIsRUFDOUIsTUFBNEIsRUFDNUIsVUFBa0IsRUFDbEIsa0JBQTJCO1FBRTNCLElBQU0sRUFBRSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDMUIsUUFBUSxDQUFDLHNCQUFzQixDQUM3QixFQUFFLEVBQ0YsU0FBUyxFQUNULGNBQWMsRUFDZCxNQUFNLEVBQ04sVUFBVSxFQUNWLGtCQUFrQixDQUNuQixDQUFDO1FBQ0YsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUFsSkQsSUFrSkM7QUFsSlksNEJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UgfSBmcm9tIFwiLi9uYXRpdmUvTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlXCI7XHJcbmltcG9ydCB7IE5hdGl2ZVBvbHlOb2RlIH0gZnJvbSBcIi4vbmF0aXZlL05hdGl2ZVBvbHlOb2RlXCI7XHJcbmltcG9ydCB7IG5hdGl2ZVBhdGhUb1BhdGggfSBmcm9tIFwiLi9uYXRpdmUvUGF0aFRvTmF0aXZlUGF0aFwiO1xyXG5pbXBvcnQgeyBSZWFkb25seVBhdGggfSBmcm9tIFwiLi9QYXRoXCI7XHJcblxyXG4vKipcclxuICogUG9seU5vZGVzIGFyZSBlbmNhcHN1bGF0ZWQgd2l0aGluIGEgUG9seVRyZWUgY29udGFpbmVyLCBhbmQgdG9nZXRoZXIgcHJvdmlkZSBhIGRhdGEgc3RydWN0dXJlIHJlcHJlc2VudGluZyB0aGUgcGFyZW50LWNoaWxkIHJlbGF0aW9uc2hpcHMgb2YgcG9seWdvblxyXG4gKiBjb250b3VycyByZXR1cm5lZCBieSBjbGlwcGluZy9vZnNldHRpbmcgbWV0aG9kcy5cclxuICpcclxuICogQSBQb2x5Tm9kZSBvYmplY3QgcmVwcmVzZW50cyBhIHNpbmdsZSBwb2x5Z29uLiBJdCdzIGlzSG9sZSBwcm9wZXJ0eSBpbmRpY2F0ZXMgd2hldGhlciBpdCdzIGFuIG91dGVyIG9yIGEgaG9sZS4gUG9seU5vZGVzIG1heSBvd24gYW55IG51bWJlciBvZiBQb2x5Tm9kZVxyXG4gKiBjaGlsZHJlbiAoY2hpbGRzKSwgd2hlcmUgY2hpbGRyZW4gb2Ygb3V0ZXIgcG9seWdvbnMgYXJlIGhvbGVzLCBhbmQgY2hpbGRyZW4gb2YgaG9sZXMgYXJlIChuZXN0ZWQpIG91dGVyIHBvbHlnb25zLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBvbHlOb2RlIHtcclxuICBwcm90ZWN0ZWQgX3BhcmVudD86IFBvbHlOb2RlO1xyXG5cclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBwYXJlbnQgUG9seU5vZGUuXHJcbiAgICpcclxuICAgKiBUaGUgUG9seVRyZWUgb2JqZWN0ICh3aGljaCBpcyBhbHNvIGEgUG9seU5vZGUpIGRvZXMgbm90IGhhdmUgYSBwYXJlbnQgYW5kIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cclxuICAgKi9cclxuICBnZXQgcGFyZW50KCk6IFBvbHlOb2RlIHwgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2NoaWxkczogUG9seU5vZGVbXSA9IFtdO1xyXG4gIC8qKlxyXG4gICAqIEEgcmVhZC1vbmx5IGxpc3Qgb2YgUG9seU5vZGUuXHJcbiAgICogT3V0ZXIgUG9seU5vZGUgY2hpbGRzIGNvbnRhaW4gaG9sZSBQb2x5Tm9kZXMsIGFuZCBob2xlIFBvbHlOb2RlIGNoaWxkcyBjb250YWluIG5lc3RlZCBvdXRlciBQb2x5Tm9kZXMuXHJcbiAgICovXHJcbiAgZ2V0IGNoaWxkcygpOiBQb2x5Tm9kZVtdIHtcclxuICAgIHJldHVybiB0aGlzLl9jaGlsZHM7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2NvbnRvdXI6IFJlYWRvbmx5UGF0aCA9IFtdO1xyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBwYXRoIGxpc3Qgd2hpY2ggY29udGFpbnMgYW55IG51bWJlciBvZiB2ZXJ0aWNlcy5cclxuICAgKi9cclxuICBnZXQgY29udG91cigpOiBSZWFkb25seVBhdGgge1xyXG4gICAgcmV0dXJuIHRoaXMuX2NvbnRvdXI7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2lzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdHJ1ZSB3aGVuIHRoZSBQb2x5Tm9kZSdzIENvbnRvdXIgcmVzdWx0cyBmcm9tIGEgY2xpcHBpbmcgb3BlcmF0aW9uIG9uIGFuIG9wZW4gY29udG91ciAocGF0aCkuIE9ubHkgdG9wLWxldmVsIFBvbHlOb2RlcyBjYW4gY29udGFpbiBvcGVuIGNvbnRvdXJzLlxyXG4gICAqL1xyXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5faXNPcGVuO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9pbmRleDogbnVtYmVyID0gMDtcclxuICAvKipcclxuICAgKiBJbmRleCBpbiB0aGUgcGFyZW50J3MgY2hpbGQgbGlzdCwgb3IgMCBpZiBubyBwYXJlbnQuXHJcbiAgICovXHJcbiAgZ2V0IGluZGV4KCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5faW5kZXg7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgX2lzSG9sZT86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0cnVlIHdoZW4gdGhlIFBvbHlOb2RlJ3MgcG9seWdvbiAoQ29udG91cikgaXMgYSBob2xlLlxyXG4gICAqXHJcbiAgICogQ2hpbGRyZW4gb2Ygb3V0ZXIgcG9seWdvbnMgYXJlIGFsd2F5cyBob2xlcywgYW5kIGNoaWxkcmVuIG9mIGhvbGVzIGFyZSBhbHdheXMgKG5lc3RlZCkgb3V0ZXIgcG9seWdvbnMuXHJcbiAgICogVGhlIGlzSG9sZSBwcm9wZXJ0eSBvZiBhIFBvbHlUcmVlIG9iamVjdCBpcyB1bmRlZmluZWQgYnV0IGl0cyBjaGlsZHJlbiBhcmUgYWx3YXlzIHRvcC1sZXZlbCBvdXRlciBwb2x5Z29ucy5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XHJcbiAgICovXHJcbiAgZ2V0IGlzSG9sZSgpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLl9pc0hvbGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBsZXQgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgbGV0IG5vZGU6IFBvbHlOb2RlIHwgdW5kZWZpbmVkID0gdGhpcy5fcGFyZW50O1xyXG4gICAgICB3aGlsZSAobm9kZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gIXJlc3VsdDtcclxuICAgICAgICBub2RlID0gbm9kZS5fcGFyZW50O1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2lzSG9sZSA9IHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5faXNIb2xlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIHJldHVybmVkIFBvbHlOb2RlIHdpbGwgYmUgdGhlIGZpcnN0IGNoaWxkIGlmIGFueSwgb3RoZXJ3aXNlIHRoZSBuZXh0IHNpYmxpbmcsIG90aGVyd2lzZSB0aGUgbmV4dCBzaWJsaW5nIG9mIHRoZSBQYXJlbnQgZXRjLlxyXG4gICAqXHJcbiAgICogQSBQb2x5VHJlZSBjYW4gYmUgdHJhdmVyc2VkIHZlcnkgZWFzaWx5IGJ5IGNhbGxpbmcgR2V0Rmlyc3QoKSBmb2xsb3dlZCBieSBHZXROZXh0KCkgaW4gYSBsb29wIHVudGlsIHRoZSByZXR1cm5lZCBvYmplY3QgaXMgdW5kZWZpbmVkLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7UG9seU5vZGUgfCB1bmRlZmluZWR9XHJcbiAgICovXHJcbiAgZ2V0TmV4dCgpOiBQb2x5Tm9kZSB8IHVuZGVmaW5lZCB7XHJcbiAgICBpZiAodGhpcy5fY2hpbGRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkc1swXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldE5leHRTaWJsaW5nVXAoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXROZXh0U2libGluZ1VwKCk6IFBvbHlOb2RlIHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICh0aGlzLl9wYXJlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLl9pbmRleCA9PT0gdGhpcy5fcGFyZW50Ll9jaGlsZHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAvL25vaW5zcGVjdGlvbiBUYWlsUmVjdXJzaW9uSlNcclxuICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudC5nZXROZXh0U2libGluZ1VwKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcGFyZW50Ll9jaGlsZHNbdGhpcy5faW5kZXggKyAxXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gIHByb3RlY3RlZCBzdGF0aWMgZmlsbEZyb21OYXRpdmVQb2x5Tm9kZShcclxuICAgIHBuOiBQb2x5Tm9kZSxcclxuICAgIG5hdGl2ZUxpYjogTmF0aXZlQ2xpcHBlckxpYkluc3RhbmNlLFxyXG4gICAgbmF0aXZlUG9seU5vZGU6IE5hdGl2ZVBvbHlOb2RlLFxyXG4gICAgcGFyZW50OiBQb2x5Tm9kZSB8IHVuZGVmaW5lZCxcclxuICAgIGNoaWxkSW5kZXg6IG51bWJlcixcclxuICAgIGZyZWVOYXRpdmVQb2x5Tm9kZTogYm9vbGVhblxyXG4gICk6IHZvaWQge1xyXG4gICAgcG4uX3BhcmVudCA9IHBhcmVudDtcclxuXHJcbiAgICBjb25zdCBjaGlsZHMgPSBuYXRpdmVQb2x5Tm9kZS5jaGlsZHM7XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbWF4ID0gY2hpbGRzLnNpemUoKTsgaSA8IG1heDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IG5ld0NoaWxkID0gUG9seU5vZGUuZnJvbU5hdGl2ZVBvbHlOb2RlKFxyXG4gICAgICAgIG5hdGl2ZUxpYixcclxuICAgICAgICBjaGlsZHMuZ2V0KGkpLFxyXG4gICAgICAgIHBuLFxyXG4gICAgICAgIGksXHJcbiAgICAgICAgZnJlZU5hdGl2ZVBvbHlOb2RlXHJcbiAgICAgICk7XHJcbiAgICAgIHBuLl9jaGlsZHMucHVzaChuZXdDaGlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZG8gd2UgbmVlZCB0byBjbGVhciB0aGUgb2JqZWN0IG91cnNlbHZlcz8gZm9yIG5vdyBsZXQncyBhc3N1bWUgc28gKHNlZW1zIHRvIHdvcmspXHJcbiAgICBwbi5fY29udG91ciA9IG5hdGl2ZVBhdGhUb1BhdGgobmF0aXZlTGliLCBuYXRpdmVQb2x5Tm9kZS5jb250b3VyLCB0cnVlKTtcclxuICAgIHBuLl9pc09wZW4gPSBuYXRpdmVQb2x5Tm9kZS5pc09wZW4oKTtcclxuICAgIHBuLl9pbmRleCA9IGNoaWxkSW5kZXg7XHJcblxyXG4gICAgaWYgKGZyZWVOYXRpdmVQb2x5Tm9kZSkge1xyXG4gICAgICBuYXRpdmVQb2x5Tm9kZS5kZWxldGUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBzdGF0aWMgZnJvbU5hdGl2ZVBvbHlOb2RlKFxyXG4gICAgbmF0aXZlTGliOiBOYXRpdmVDbGlwcGVyTGliSW5zdGFuY2UsXHJcbiAgICBuYXRpdmVQb2x5Tm9kZTogTmF0aXZlUG9seU5vZGUsXHJcbiAgICBwYXJlbnQ6IFBvbHlOb2RlIHwgdW5kZWZpbmVkLFxyXG4gICAgY2hpbGRJbmRleDogbnVtYmVyLFxyXG4gICAgZnJlZU5hdGl2ZVBvbHlOb2RlOiBib29sZWFuXHJcbiAgKTogUG9seU5vZGUge1xyXG4gICAgY29uc3QgcG4gPSBuZXcgUG9seU5vZGUoKTtcclxuICAgIFBvbHlOb2RlLmZpbGxGcm9tTmF0aXZlUG9seU5vZGUoXHJcbiAgICAgIHBuLFxyXG4gICAgICBuYXRpdmVMaWIsXHJcbiAgICAgIG5hdGl2ZVBvbHlOb2RlLFxyXG4gICAgICBwYXJlbnQsXHJcbiAgICAgIGNoaWxkSW5kZXgsXHJcbiAgICAgIGZyZWVOYXRpdmVQb2x5Tm9kZVxyXG4gICAgKTtcclxuICAgIHJldHVybiBwbjtcclxuICB9XHJcbn1cclxuIl19