export default function compute_mouse_position_relative_to_element(e:MouseEvent, element:HTMLDivElement){
	let rect = element.getBoundingClientRect()
	return {
		x:e.clientX-rect.x,
		y:e.clientY-rect.y
	}
}