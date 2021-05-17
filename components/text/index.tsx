import styled from "styled-components";

type TextOptions = {
    color?: string,
    cursor?: string,
}

export const MediumText = styled.div`
  font-size: 3vw;
  font-weight: 600;
  color: ${(props) => props.color && props.color || 'darkslategray'};
  cursor: ${({cursor}) => cursor && cursor};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media screen and (max-width: 500px) {
    font-size: 25px;
    word-break: break-word;
    white-space: normal;  
    text-align: center;
    max-width: 90%;
  }
`;

export const SmallText = styled.div`
  font-size: 2vw;
  font-weight: 600;
  color: ${(props) => props.color && props.color || 'darkslategray'};
  cursor: ${({cursor}) => cursor && cursor};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  @media screen and (max-width: 500px) {
    font-size: 18px;
    text-align: center;
  }
`;
