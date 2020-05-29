import React, { useState, useRef } from "react";
import Aux from "../hoc/Auxiliary/Auxiliary";

import classes from './DragAndDrop.module.css'

const DragAndDrop = () =>
{
    const [dragging, setDragging] = useState(false);

    
   // 

    const [list, setList] = useState([
        {title: "Group X", items: ["11", "22", "33", "77"]},
        {title: "Group Y", items: ["44", "55"]}
    ])

    const dragItem = useRef();
    const dragNode = useRef();

    const handleDragStart = (event, params) => {
        console.log("Drag starting");
        //console.log("Params: ", params);
        //console.log("Group Index: ", params.grpI);
        //console.log("Item Index: ", params.itemI);
        dragItem.current = params;
        //console.log("dragItem: ", dragItem);
        dragNode.current = event.target;
        //console.log("dragNode: ", dragNode);
        dragNode.current.addEventListener('dragend', handleDragEnd);
        setTimeout(() => {
            setDragging(true);
        }, 0)
        
        dragNode.current = event.target;
    }

    const handleDragEnd = () => {
        console.log("ending the current drag");
        dragNode.current.removeEventListener('dragend', handleDragEnd);
        dragItem.current = null;
        dragNode.current = null;
        setDragging(false);
    }

    const handleDragEnter = (event, params) => {
        console.log("Entered the drag: ", params)
        //console.log("event.target", event.target)
        //console.log("dragNode.current", dragNode.current)
        const currentItem = dragItem.current;
        if (dragNode.current !== event.target) {
            console.log("DIFFERENT TARGET");
            
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList));
                //newList[params.grpI].items.splice(params.itemI, 0, newList[currentItem.grpI].items.splice(currentItem.itemI,1)[0]);
                newList[params.grpI].items.splice(1, 0, 2);
                console.log("newList: ", newList)
                dragItem.current = params;
                return newList
            })

        } else {
            console.log("SAME TARGET")
        }
    }

    const getStyles = (params) => {
        //console.log("Restyling")
        //console.log("Params: ", params)
        const currentItem = dragItem.current;
        //console.log("currentItem: ", currentItem);
        if (params.grpI === currentItem.grpI && params.itemI === currentItem.itemI) {
            //console.log("Match")
            return (classes.Current)
        } else {
            //console.log("NO Match")
            return (classes.DNDItem)
        }
    }

    return (
        <div className={classes.DragAndDrop}>
            {list.map((grp, grpI) => {
                return (
                    <div
                        key={grpI}
                        className={classes.DNDGroup}
                        onDragEnter={dragging && !grp.items.length ?
                            (event) => handleDragEnter(event, {grpI, itemI: 0}) :
                            null
                        }
                    >
                        <div>{grp.title}</div>
                        {grp.items.map((item, itemI) => {
                            return (
                                <div
                                    key={itemI}
                                    draggable
                                    onDragStart={(event) => handleDragStart(event, {grpI: grpI, itemI: itemI})}
                                    onDragEnter={dragging ?
                                        (event) => handleDragEnter(event, {grpI: grpI, itemI: itemI}) :
                                        null
                                    }
                                    className={dragging ?
                                        getStyles({grpI: grpI, itemI: itemI}) :
                                        classes.DNDItem
                                    }
                                >
                                    {item}
                                </div>
                            )
                        })}
                    </div>)
            })}
        </div>
    )
}

export default DragAndDrop;