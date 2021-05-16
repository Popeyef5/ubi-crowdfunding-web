import styled from "styled-components"
import { Box } from "rebass/styled-components"

const Card = styled(Box)`
  width: 100%;
  height: fit-content;
  max-height: 100%;
  border-radius: 16px;
  border: 2px solid var(--secondary);
  padding: 1.25rem;
`
export default Card