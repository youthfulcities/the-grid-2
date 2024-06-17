'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  View,
} from '@aws-amplify/ui-react';
import { v4 as uuidv4 } from 'uuid';

interface CSVRow {
  [key: string]: string | boolean | number;
}

interface AppProps {
  csvData: CSVRow[];
}

const DataTable = ({ csvData }: AppProps) => (
  // Function to render HTML table

  <View style={{ maxHeight: '500px', overflow: 'auto', marginTop: '4rem' }}>
    <Table>
      <TableHead>
        <TableRow>
          {csvData.length > 0 &&
            Object.keys(csvData[0]).map((key) => (
              <TableCell style={{ padding: '0.5rem' }} key={key}>
                {key}
              </TableCell>
            ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {csvData.map((row) => (
          <TableRow key={uuidv4()}>
            {Object.values(row).map((value) => (
              <TableCell style={{ padding: '0.5rem' }} key={uuidv4()}>
                {String(value)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </View>
);
export default DataTable;
