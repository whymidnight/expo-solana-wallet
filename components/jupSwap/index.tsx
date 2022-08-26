import { useFocusEffect } from "@react-navigation/native";
import { Box, Center, Text } from "native-base";
import React, { useRef, useState, useEffect } from "react";
import { Dimensions, View } from "react-native";
import { LineChart } from "react-native-wagmi-charts";
import { SwapUI } from "./swapUI";

interface PriceData {
  timestamp: number; // epoch ms precision
  value: number; // USD price
}

const PriceChart = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);

  const safeWidth = (() => {
    return Dimensions.get("window").width * 0.9;
  })();

  const safeHeight = (() => {
    return Dimensions.get("window").height * 0.3;
  })();

  useEffect(() => {
    async function getPriceData() {
      const coinGeckoPricing = await (
        await fetch(
          "https://www.coingecko.com/price_charts/24289/usd/7_days.json"
        )
      ).json();

      const stats = coinGeckoPricing.stats;

      let priceStats: PriceData[] = stats.map(
        ([timestamp, price]: Number[]) => {
          return {
            timestamp: timestamp,
            value: price,
          } as PriceData;
        }
      );

      setPriceData(priceStats);
    }

    getPriceData();
  }, []);

  return (
    <Box pb="5">
      <Center>
        <LineChart.Provider
          style={{ justifyContent: "center", alignItems: "center" }}
          data={priceData}
        >
          <LineChart
            style={{ justifyContent: "center", alignItems: "center" }}
            width={safeWidth}
            height={safeHeight}
          >
            <LineChart.Path color="#37AA9C">
              <LineChart.Gradient color="#94F3E4" />
            </LineChart.Path>
            <LineChart.CursorCrosshair color="#1A1A1B" size={12} outerSize={32}>
              <LineChart.Tooltip
                style={{
                  backgroundColor: "#1A1A1B",
                  borderRadius: 4,
                  fontSize: 18,
                  padding: 4,
                }}
                position="top"
              >
                <LineChart.PriceText style={{ color: "white" }} />
              </LineChart.Tooltip>
              <LineChart.Tooltip
                style={{
                  backgroundColor: "#1A1A1B",
                  borderRadius: 4,
                  fontSize: 18,
                  padding: 4,
                }}
                position="bottom"
              >
                <LineChart.DatetimeText style={{ color: "white" }} />
              </LineChart.Tooltip>
            </LineChart.CursorCrosshair>
          </LineChart>
        </LineChart.Provider>
      </Center>
      <Text shadow="8" color="white" textAlign="right" pr="5">
        Powered by CoinGecko
      </Text>
    </Box>
  );
};

export const JupSwapContainer = () => {
  return (
    <Box>
      <Box justifyContent="center" alignItems="center">
        <SwapUI />
      </Box>
      <PriceChart />
    </Box>
  );
};
