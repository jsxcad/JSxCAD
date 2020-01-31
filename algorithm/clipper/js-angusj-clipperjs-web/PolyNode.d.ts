import { NativeClipperLibInstance } from "./native/NativeClipperLibInstance";
import { NativePolyNode } from "./native/NativePolyNode";
import { ReadonlyPath } from "./Path";
/**
 * PolyNodes are encapsulated within a PolyTree container, and together provide a data structure representing the parent-child relationships of polygon
 * contours returned by clipping/ofsetting methods.
 *
 * A PolyNode object represents a single polygon. It's isHole property indicates whether it's an outer or a hole. PolyNodes may own any number of PolyNode
 * children (childs), where children of outer polygons are holes, and children of holes are (nested) outer polygons.
 */
export declare class PolyNode {
    protected _parent?: PolyNode;
    /**
     * Returns the parent PolyNode.
     *
     * The PolyTree object (which is also a PolyNode) does not have a parent and will return undefined.
     */
    readonly parent: PolyNode | undefined;
    protected _childs: PolyNode[];
    /**
     * A read-only list of PolyNode.
     * Outer PolyNode childs contain hole PolyNodes, and hole PolyNode childs contain nested outer PolyNodes.
     */
    readonly childs: PolyNode[];
    protected _contour: ReadonlyPath;
    /**
     * Returns a path list which contains any number of vertices.
     */
    readonly contour: ReadonlyPath;
    protected _isOpen: boolean;
    /**
     * Returns true when the PolyNode's Contour results from a clipping operation on an open contour (path). Only top-level PolyNodes can contain open contours.
     */
    readonly isOpen: boolean;
    protected _index: number;
    /**
     * Index in the parent's child list, or 0 if no parent.
     */
    readonly index: number;
    protected _isHole?: boolean;
    /**
     * Returns true when the PolyNode's polygon (Contour) is a hole.
     *
     * Children of outer polygons are always holes, and children of holes are always (nested) outer polygons.
     * The isHole property of a PolyTree object is undefined but its children are always top-level outer polygons.
     *
     * @return {boolean}
     */
    readonly isHole: boolean;
    /**
     * The returned PolyNode will be the first child if any, otherwise the next sibling, otherwise the next sibling of the Parent etc.
     *
     * A PolyTree can be traversed very easily by calling GetFirst() followed by GetNext() in a loop until the returned object is undefined.
     *
     * @return {PolyNode | undefined}
     */
    getNext(): PolyNode | undefined;
    protected getNextSiblingUp(): PolyNode | undefined;
    protected constructor();
    protected static fillFromNativePolyNode(pn: PolyNode, nativeLib: NativeClipperLibInstance, nativePolyNode: NativePolyNode, parent: PolyNode | undefined, childIndex: number, freeNativePolyNode: boolean): void;
    protected static fromNativePolyNode(nativeLib: NativeClipperLibInstance, nativePolyNode: NativePolyNode, parent: PolyNode | undefined, childIndex: number, freeNativePolyNode: boolean): PolyNode;
}
