import styled from "styled-components"

type ActionRowOptions = {
    justifyContent?: string
}

const ActionRow = styled.div`
width: 100%;
margin-bottom: 1rem;
display: flex;
flex-direction: row;
justify-content: ${({justifyContent})=> justifyContent && justifyContent};
gap: 16px;
`

export default ActionRow
