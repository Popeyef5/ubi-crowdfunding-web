import styled from "styled-components"

export const Wrapper = styled.div<{
    padding?: string,
    margin?: string,
    align?: string,
    justify?: string
}>`
width: 100%;
margin: ${(props) => props.margin && props.margin};
padding: ${(props) => props.padding && props.padding};
display: flex;
flex-direction: column;
justify-content: ${({justify}) => justify && justify || 'center'};
align-items: ${({align}) => align && align || 'center'};
`
export const Spacer = styled.div<{
    height?: string,
    width?: string
}>`
height: ${({height}) => height && height};
width: ${({width}) => width && width};
`