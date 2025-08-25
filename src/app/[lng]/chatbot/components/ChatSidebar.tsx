import {
  Button,
  CheckboxField,
  Heading,
  View,
  useBreakpointValue,
} from '@aws-amplify/ui-react';
import styled from 'styled-components';

const StyledCheckbox = styled(CheckboxField)`
  color: var(--amplify-colors-font-primary);
  margin-bottom: var(--amplify-space-xs);
  .amplify-flex {
    align-items: center;
  }
  .amplify-text {
    margin: 0;
    margin-left: var(--amplify-space-xs);
  }

  :disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SidebarContainer = styled(View)<{ $isMobile: boolean }>`
  position: ${({ $isMobile }) => ($isMobile ? 'relative' : 'sticky')};
  display: ${({ $isMobile }) => ($isMobile ? 'flex' : 'inherit')};
  top: 0;
  left: 0;
  justify-content: space-between;
  width: ${({ $isMobile }) => ($isMobile ? '100%' : 'auto')};
  padding: var(--amplify-space-xl);
  color: #fff;
  z-index: 1000;
`;

export interface Filter {
  type: 'equals' | 'notEquals';
  value: string;
}

export interface Filters {
  [key: string]: Filter[];
}

interface FilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const ChatSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const isMobile = useBreakpointValue({
    base: false,
    xs: true,
    small: true,
    medium: true,
    large: false,
    xl: false,
  });

  const options: Record<string, string[]> = {
    project: ['DEVlab', 'Pivot 2020'],
    type: ['Quotes', 'Articles', 'Webinar'],
  };

  const availableTypes = {
    DEVlab: ['Quotes', 'Articles', 'Webinar', 'Other'],
    'Pivot 2020': ['Quotes'],
    Other: ['Articles', 'Other'],
  };

  const toggleFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      let updated: Filter[];
      const exists = current.find(
        (f) => f.value === value && f.type === 'equals'
      );

      if (value === 'Other' && key === 'project') {
        if (current.some((f) => f.type === 'notEquals')) {
          const { [key]: _, ...rest } = prev; // remove key entirely
          return rest;
        }
        const allProjects = options.project;
        const notEqualsFilters = allProjects.flatMap((v) => ({
          type: 'notEquals' as const,
          value: v,
        }));
        return { ...prev, [key]: notEqualsFilters };
      }

      if (value === 'Other' && key === 'type') {
        if (current.some((f) => f.type === 'notEquals')) {
          const { [key]: _, ...rest } = prev; // remove key entirely
          return rest;
        }
        const allTypes = options.type;
        const notEqualsFilters = allTypes.flatMap((v) => ({
          type: 'notEquals' as const,
          value: v,
        }));
        return { ...prev, [key]: notEqualsFilters };
      }
      if (exists) {
        updated = current.filter(
          (f) => f.value !== value || f.type !== 'equals'
        );
      } else {
        // Remove notEquals when selecting allTypes = options.type; standard option
        updated = current.filter((f) => f.type !== 'notEquals');
        updated.push({ type: 'equals', value });
      }

      if (updated.length === 0) {
        // remove key entirely if empty
        const { [key]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [key]: updated };
    });
  };

  const isDisabled = (key: string, value: string) => {
    if (key !== 'type') return false;

    // Collect all selected projects (equals filters only)
    const selectedProjects =
      filters.project?.filter((f) => f.type === 'equals').map((f) => f.value) ||
      [];

    if (selectedProjects.length === 0) return false; // nothing selected → nothing disabled

    // If ANY selected project supports the type, it's enabled
    return !selectedProjects.some((project) =>
      availableTypes[project as keyof typeof availableTypes]?.includes(value)
    );
  };

  const isChecked = (key: string, value: string) => {
    const current = filters[key] || [];
    if (!filters.type && !filters.project) {
      return true;
    }
    if (key === 'project' && !filters.project && filters.type) {
      return true;
    }
    if (
      key === 'type' &&
      filters.project &&
      !filters.type &&
      !isDisabled('type', value)
    ) {
      return true;
    }
    if (value === 'Other' && current.some((f) => f.type === 'notEquals')) {
      return true;
    }
    return current.some((f) => f.value === value && f.type === 'equals');
  };

  return (
    <SidebarContainer $isMobile={!!isMobile}>
      {Object.entries(options).map(([key, values]) => (
        <div key={key}>
          <Heading level={5} color='font.primary' marginTop='large'>
            {key.toUpperCase()}
          </Heading>
          {values.map((value) => (
            <StyledCheckbox
              key={value}
              name={value}
              label={value}
              checked={isChecked(key, value)}
              isDisabled={isDisabled(key, value)}
              onChange={() => toggleFilter(key, value)}
            />
          ))}
          <StyledCheckbox
            key={`${key}-other`}
            name={`${key}-other`}
            label='Other'
            checked={isChecked(key, 'Other')}
            isDisabled={isDisabled(key, 'Other')}
            onChange={() => toggleFilter(key, 'Other')}
          />
        </div>
      ))}
      <View marginTop='large'>
        <Button size='small' isFullWidth onClick={() => setFilters({})}>
          Add All
        </Button>
      </View>
    </SidebarContainer>
  );
};

export default ChatSidebar;
