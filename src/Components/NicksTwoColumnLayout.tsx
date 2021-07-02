import React, { RefObject, useRef, useState, useEffect } from "react";
import compute_mouse_position_relative_to_element from "./util/compute_mouse_position_relative_to_element";
import CSS from "csstype";


export default function NicksTwoColumnLayout({
	children,
	columnGapPx = 8,
	paddingPx = 0,
	initial_left_column_width = 400,
	onUserResize = undefined,
}: {
	children: Array<React.ReactNode>;
	columnGapPx?: number;
	paddingPx?: number;
	initial_left_column_width?: number;
	onUserResize?: (...args: any) => any;
}) {
	
	let [left_column_width, set_left_column_width] = useState(initial_left_column_width);
	let [can_drag, set_can_drag] = useState(false);
	let [is_dragging, set_is_dragging] = useState(false);
	let container_ref: RefObject<HTMLDivElement> = useRef(null);


	useEffect(()=>{
		if(container_ref.current === null) throw new Error("unable to mount since ref.current is null")
		let current_ref = container_ref.current;
		let handel_mouse_move = (e:MouseEvent)=>{
			let local_mouse_position = compute_mouse_position_relative_to_element(e, current_ref)
			if (Math.abs(local_mouse_position.x - (left_column_width + columnGapPx / 2)) < columnGapPx) {
				set_can_drag(true);
			} else {
				set_can_drag(false);
			}
			if(is_dragging){
				set_left_column_width(local_mouse_position.x - columnGapPx / 2);
				if (onUserResize) {
					onUserResize();
				}
			}
		}
		current_ref.addEventListener("mousemove", handel_mouse_move)
		return ()=>{
			current_ref.removeEventListener("mousemove", handel_mouse_move);
		}
	},[container_ref, is_dragging, columnGapPx, left_column_width, onUserResize])

	const start_drag = (event: React.MouseEvent) => {
		if (can_drag) {
			set_is_dragging(true);
		}
	}

	const end_drag = (event: React.MouseEvent) => {
		set_is_dragging(false);
	}

	let container_style: CSS.Properties = {
		display: "grid",
		height: `calc(100% - ${paddingPx}px * 2)`,
		gridTemplateColumns: `${left_column_width.toFixed(0)}px 1fr`,
		columnGap: `${columnGapPx}px`,
		//padding: `${paddingPx}px`,
		margin: `${paddingPx}px`,
		cursor:can_drag?"ew-resize":"auto",
		boxSizing:"border-box"
	};
		

	return (
		<div
			ref={container_ref}
			className="NicksTwoColumnLayout-Container"
			style={container_style}
			onMouseDown={start_drag}
			onMouseUp={end_drag}
			onMouseLeave={end_drag}
		>
			<div className="NicksTwoColumnLayout-Column">{children[0]}</div>
			<div className="NicksTwoColumnLayout-Column">{children[1]}</div>
		</div>
	);
}