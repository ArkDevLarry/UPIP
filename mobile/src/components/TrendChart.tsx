import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { useTheme } from '../theme/ThemeContext';
import { tokens } from '../theme/tokens';
import { Card } from './Card';

const { width } = Dimensions.get('window');

interface TrendChartProps {
  type: 'line' | 'bar';
  data: { label: string; value: number }[];
  title: string;
  color?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ type, data, title, color }) => {
  const { theme } = useTheme();
  const activeColor = color || theme.colors.primary;
  const chartWidth = width - 110; 
  const chartData = data.map(d => ({ 
    value: d.value, 
    label: d.label,
    labelTextStyle: { color: theme.colors.text.secondary, fontSize: 8 }
  }));

  return (
    <Card title={title}>
      <View style={styles.chartContainer}>
        {type === 'line' ? (
          <LineChart
            data={chartData}
            height={120}
            width={chartWidth}
            maxValue={120}
            noOfSections={3}
            color={activeColor}
            thickness={3}
            startFillColor={activeColor}
            endFillColor={activeColor}
            startOpacity={0.2}
            endOpacity={0.01}
            areaChart
            yAxisThickness={0}
            xAxisThickness={0}
            hideDataPoints
            curved
            rulesStyle={{ color: theme.colors.border }}
            rulesType="solid"
            yAxisTextStyle={[styles.yAxisText, { color: theme.colors.text.secondary }]}
            xAxisLabelTextStyle={[styles.xAxisText, { color: theme.colors.text.secondary }]}
            pointerConfig={{
              pointerStripColor: activeColor,
              pointerStripWidth: 2,
              pointerColor: activeColor,
              radius: 4,
              pointerLabelComponent: (items: any) => {
                return (
                  <View style={[styles.pointerLabel, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <Text style={{ color: theme.colors.text.primary, fontWeight: 'bold', fontSize: 10 }}>{items[0].value}</Text>
                  </View>
                );
              }
            }}
          />
        ) : (
          <BarChart
            data={chartData}
            height={120}
            width={chartWidth}
            maxValue={16000}
            barWidth={18}
            barBorderRadius={4}
            frontColor={activeColor}
            opacity={0.8}
            initialSpacing={15}
            noOfSections={3}
            yAxisThickness={0}
            xAxisThickness={0}
            rulesStyle={{ color: theme.colors.border }}
            rulesType="solid"
            yAxisTextStyle={[styles.yAxisText, { color: theme.colors.text.secondary }]}
            xAxisLabelTextStyle={[styles.xAxisText, { color: theme.colors.text.secondary }]}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginLeft: -10,
    marginTop: 10,
    alignItems: 'center',
  },
  yAxisText: {
    fontSize: 10,
  },
  xAxisText: {
    fontSize: 10,
  },
  pointerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});