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
`;

export const SmallText = styled.div`
  font-size: 2vw;
  font-weight: 600;
  color: ${(props) => props.color && props.color || 'darkslategray'};
  cursor: ${({cursor}) => cursor && cursor};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
