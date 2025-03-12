import Tooltip from '@/app/components/Tooltip';
import useDownloadFile from '@/hooks/useDownloadFile';
import { Button, useTheme, View } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { IconType } from 'react-icons';
import {
  FaBook,
  FaDownload,
  FaFileArrowDown,
  FaFileLines,
  FaFilePdf,
  FaNewspaper,
  FaQuoteLeft,
  FaTable,
  FaUpRightFromSquare,
  FaVideo,
  FaWrench,
} from 'react-icons/fa6';
import styled from 'styled-components';

const StyledButton = styled(Button)<{ $background: string; $inverse: string }>`
  justify-content: center;
  width: 50px;
  height: 50px;
  align-items: center;
  position: relative;
  padding: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10000000149011612);
  border-radius: 35px;
  background-color: ${(props) => props.$inverse};
  margin-top: auto;
  color: ${(props) => props.$background};
  z-index: 1;
  &:hover {
    background-color: ${(props) => props.$background};
    color: ${(props) => props.$inverse};
  }
`;

const TooltipWrapper = styled(View)`
  position: relative;
`;

const StyledLink = styled.a``;

interface ColorGetter {
  (index: number): { button: string; buttonInverse: string };
}

interface AppProps {
  fetchUrl: (url: string) => Promise<{ url: URL; expiresAt: Date } | null>;
  index: number;
  getColor: ColorGetter;
  file?: string;
  link?: string;
  type?: string;
  tooltipMsg: string;
  tooltipDesc?: string;
}

const DataCardButton = ({
  getColor,
  index,
  fetchUrl,
  file,
  link,
  tooltipMsg,
  tooltipDesc,
  type = 'button',
}: AppProps) => {
  const { tokens } = useTheme();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { downloadFile } = useDownloadFile();

  // Define a mapping from type to icon component
  const typeToIconMap: { [key: string]: IconType } = {
    press: FaNewspaper,
    tool: FaWrench,
    methodology: FaBook,
    pdf: FaFilePdf,
    download: FaFileArrowDown,
    link: FaUpRightFromSquare,
    video: FaVideo,
    report: FaFileLines,
    codebook: FaTable,
    quotes: FaQuoteLeft,
  };

  const checkType = (currentType: string) =>
    typeToIconMap[currentType] || FaDownload;

  const Icon = checkType(type);

  return (
    <div>
      {type === 'link' ? (
        <StyledLink href={link} target='_blank'>
          <TooltipWrapper>
            <Tooltip showTooltip={showTooltip} tooltipMsg={tooltipMsg}>
              <StyledButton
                $background={getColor(index).button}
                $inverse={getColor(index).buttonInverse}
                variation='primary'
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
              >
                <Icon size={tokens.space.large.value} />
              </StyledButton>
            </Tooltip>
          </TooltipWrapper>
        </StyledLink>
      ) : (
        <TooltipWrapper>
          <Tooltip
            showTooltip={showTooltip}
            tooltipMsg={tooltipMsg}
            tooltipDesc={tooltipDesc}
          >
            <StyledButton
              $background={getColor(index).button}
              $inverse={getColor(index).buttonInverse}
              onClick={() => downloadFile(file || '')}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
            >
              <Icon size={tokens.space.large.value} />
            </StyledButton>
          </Tooltip>
        </TooltipWrapper>
      )}
    </div>
  );
};

export default DataCardButton;
