import * as React from "react"
import Svg, { Path } from "react-native-svg"

const RightArrow = ({ color }) => {
  return (
    <Svg
      viewBox="0 0 486.963 486.963"
      width={28}
      height={28}
    >
      <Path fill={color} stroke={color} strokeWidth={10} d="M483 233.869l-139-139c-5.3-5.3-13.8-5.3-19.1 0-5.3 5.3-5.3 13.8 0 19.1l116 116H13.5c-7.5 0-13.5 6-13.5 13.5s6 13.5 13.5 13.5h427.4l-116 116c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l139-139c5.4-5.4 5.4-14 .1-19.2z" />
    </Svg>
  )
}

export default RightArrow
