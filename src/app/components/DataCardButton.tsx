import useTranslation from '@/app/i18n/client';
import { Button, useTheme } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { FaFileArrowDown } from 'react-icons/fa6';
import styled from 'styled-components';
import Tooltip from './Tooltip';

const StyledButton = styled(Button)<{ $background: string; $inverse: string }>`
  justify-content: center;
  width: 50px;
  height: 50px;
  align-items: center;
  position: relative;
  padding: 0;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.10000000149011612);
  border-radius: 35px;
  background-color: ${(props) => props.$background};
  margin-top: auto;
  color: ${(props) => props.$inverse};
  z-index: 1;
  &:hover {
    background-color: ${(props) => props.$inverse};
    color: ${(props) => props.$background};
  }
`;

interface DatasetCard {
  title: string;
  titlefr: string;
  date: string;
  desc: string;
  descfr: string;
  file: string;
  className: string;
}

interface ColorGetter {
  (index: number): { button: string; buttonInverse: string };
}

interface AppProps {
  fetchUrl: (url: string) => Promise<{ url: URL; expiresAt: Date } | null>;
  index: number;
  getColor: ColorGetter;
  card: DatasetCard;
  lng: string;
}

const DataCardButton = ({ getColor, index, fetchUrl, card, lng }: AppProps) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const { t } = useTranslation(lng, 'datasets');
  const { tokens } = useTheme();

  const download = async (file: string) => {
    try {
      const getUrlResult: { url: URL; expiresAt: Date } | null =
        await fetchUrl(file);
      window.open(getUrlResult?.url.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <StyledButton
      $background={getColor(index).button}
      $inverse={getColor(index).buttonInverse}
      variation='primary'
      onClick={() => download(card.file)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <FaFileArrowDown size={tokens.space.large.value} />
      <Tooltip showTooltip={showTooltip}>{t('csv')}</Tooltip>
    </StyledButton>
  );
};

export default DataCardButton;
