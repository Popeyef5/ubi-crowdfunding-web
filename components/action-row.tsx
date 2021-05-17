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
align-items: center;
gap: 16px;

@media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: start;
}
`

export default ActionRow
