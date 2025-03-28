/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <map>
#include <string>

#include "base/containers/contains.h"
#include "mises/components/brave_wallet/browser/brave_wallet_constants.h"
#include "mises/components/brave_wallet/common/brave_wallet.mojom-shared.h"

namespace brave_wallet {

const std::vector<mojom::BlockchainToken>& GetRampBuyTokens() {
  static base::NoDestructor<std::vector<mojom::BlockchainToken>> tokens(
      {{"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "BNB", "", true, false, false, false, "BNB", 18, true, "", "",
        mojom::kBinanceSmartChainMainnetChainId, mojom::CoinType::ETH},
       {"", "Avalanche", "", false, false, false, false, "AVAX", 18, true, "",
        "", mojom::kAvalancheMainnetChainId, mojom::CoinType::ETH},
       {"", "Filecoin", "", false, false, false, false, "FIL", 18, true, "", "",
        mojom::kFilecoinMainnet, mojom::CoinType::FIL},
       {"", "Celo", "", false, false, false, false, "CELO", 18, true, "", "",
        mojom::kCeloMainnetChainId, mojom::CoinType::ETH},
       {"0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", "Celo Euro", "ceur.png",
        true, false, false, false, "CEUR", 18, true, "", "",
        mojom::kCeloMainnetChainId, mojom::CoinType::ETH},
       {"0x765DE816845861e75A25fCA122bb6898B8B1282a", "Celo Dollar", "cusd.png",
        true, false, false, false, "CUSD", 18, true, "", "",
        mojom::kCeloMainnetChainId, mojom::CoinType::ETH},
       {"0x6b175474e89094c44da98b954eedeac495271d0f", "DAI Stablecoin",
        "dai.png", true, false, false, false, "DAI", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kOptimismMainnetChainId, mojom::CoinType::ETH},
       {"", "Polygon", "", false, false, false, false, "MATIC", 18, true, "",
        "", mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", "DAI Stablecoin",
        "dai.png", true, false, false, false, "DAI", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", "Ethereum", "eth.png",
        true, false, false, false, "ETH", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0xbbba073c31bf03b8acf7c28ef0738decf3695683", "Sandbox", "sand.png",
        true, false, false, false, "SAND", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x0f5d2fb29fb7d3cfee444a200298f468908cc942", "Decentraland",
        "mana.png", true, false, false, false, "MANA", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4", "Decentraland",
        "mana.png", true, false, false, false, "MANA", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x3Cef98bb43d732E2F285eE605a8158cDE967D219", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"", "Solana", "", false, false, false, false, "SOL", 9, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "Tether", "usdt.png",
        false, false, false, false, "USDT", 6, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"0xdac17f958d2ee523a2206206994597c13d831ec7", "Tether", "usdt.png",
        true, false, false, false, "USDT", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x0d8775f648430679a709e98d2b0cb6250d2887ef", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL}});
  return *tokens;
}

const std::vector<mojom::BlockchainToken>& GetSardineBuyTokens() {
  static base::NoDestructor<std::vector<mojom::BlockchainToken>> tokens(
      {{"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "AAVE", "aave.png", true,
        false, false, false, "AAVE", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "AAVE", "aave.png", true,
        false, false, false, "AAVE", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"", "Avalanche", "", false, false, false, false, "AVAX", 18, true, "",
        "", mojom::kAvalancheMainnetChainId, mojom::CoinType::ETH},
       {"0x0d8775f648430679a709e98d2b0cb6250d2887ef", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x4Fabb145d64652a948d72533023f6E7A623C7C53", "Binance USD", "BUSD.png",
        true, false, false, false, "BUSD", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x4Fabb145d64652a948d72533023f6E7A623C7C53", "Binance USD", "busd.png",
        true, false, false, false, "BUSD", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xc00e94cb662c3520282e6f5717214004a7f26888", "Compound", "comp.png",
        true, false, false, false, "COMP", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x6B175474E89094C44Da98b954EedeAC495271d0F", "DAI", "dai.png", true,
        false, false, false, "DAI", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0x0f5d2fb29fb7d3cfee444a200298f468908cc942", "Decentraland",
        "mana.png", true, false, false, false, "MANA", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c", "Enjin Coin", "enj.png",
        true, false, false, false, "ENJ", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Fantom", "", false, false, false, false, "FTM", 18, true, "", "",
        mojom::kFantomMainnetChainId, mojom::CoinType::ETH},
       {"0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202", "Kyber Network",
        "kyber.png", true, false, false, false, "KNC", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", "Maker", "mkr.png", true,
        false, false, false, "MKR", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0xd26114cd6ee289accf82350c8d8487fedb8a0c07", "OMG Network", "omg.png",
        true, false, false, false, "OMG", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Polygon", "", false, false, false, false, "MATIC", 18, true, "",
        "", mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", "Polygon", "matic.png",
        false, false, false, false, "MATIC", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x45804880de22913dafe09f4980848ece6ecbaf78", "Pax Gold", "paxg.png",
        true, false, false, false, "PAXG", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x8e870d67f660d95d5be530380d0ec0bd388289e1", "Pax Dollar", "usdp.png",
        true, false, false, false, "PAX", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce", "Shiba Inu", "shib.png",
        true, false, false, false, "SHIB", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Solana", "", false, false, false, false, "SOL", 9, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"0xdAC17F958D2ee523a2206206994597C13D831ec7", "Tether", "usdt.png",
        true, false, false, false, "USDT", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "Uniswap", "uni.png",
        true, false, false, false, "UNI", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xe41d2489571d322189246dafa5ebde1f4699f498", "Ox", "zrx.png", true,
        false, false, false, "ZRX", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH}});
  return *tokens;
}

const std::vector<mojom::BlockchainToken>& GetTransakBuyTokens() {
  static base::NoDestructor<std::vector<mojom::BlockchainToken>> tokens(
      {{"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kOptimismMainnetChainId, mojom::CoinType::ETH},
       {"0xdAC17F958D2ee523a2206206994597C13D831ec7", "Tether", "usdt.png",
        true, false, false, false, "USDT", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kArbitrumMainnetChainId, mojom::CoinType::ETH},
       {"0xc2132D05D31c914a87C6611C10748AEb04B58e8F", "Tether", "usdt.png",
        true, false, false, false, "USDT", 6, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "Tether", "usdt.png",
        false, false, false, false, "USDT", 6, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", "Uniswap", "uni.png",
        true, false, false, false, "UNI", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x2791bca1f2de4661ed88a30c99a7a9449aa84174", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kAvalancheMainnetChainId, mojom::CoinType::ETH},
       {"0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kBinanceSmartChainMainnetChainId, mojom::CoinType::ETH},
       {"0x7F5c764cBc14f9669B88837ca1490cCa17c31607", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kOptimismMainnetChainId, mojom::CoinType::ETH},
       {"0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kArbitrumMainnetChainId, mojom::CoinType::ETH},
       {"0x514910771AF9Ca656af840dff83E8264EcF986CA", "Chainlink",
        "chainlink.png", true, false, false, false, "LINK", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "Wrapped Bitcoin",
        "wbtc.png", true, false, false, false, "WBTC", 8, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Solana", "", false, false, false, false, "SOL", 9, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", "Lido Staked Ether",
        "steth.png", true, false, false, false, "STETH", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Polygon", "", false, false, false, false, "MATIC", 18, true, "",
        "", mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x6B175474E89094C44Da98b954EedeAC495271d0F", "DAI", "dai.png", true,
        false, false, false, "DAI", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0x4Fabb145d64652a948d72533023f6E7A623C7C53", "Binance USD", "busd.png",
        true, false, false, false, "BUSD", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", "AAVE", "aave.png", true,
        false, false, false, "AAVE", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0x4d224452801ACEd8B2F0aebE155379bb5D594381", "ApeCoin", "ape.png",
        true, false, false, false, "APE", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x3845badade8e6dff049820680d1f14bd3903a5d0", "The Sandbox", "sand.png",
        true, false, false, false, "SAND", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Avalanche", "", false, false, false, false, "AVAX", 18, true, "",
        "", mojom::kAvalancheMainnetChainId, mojom::CoinType::ETH},
       {"0x0f5d2fb29fb7d3cfee444a200298f468908cc942", "Decentraland",
        "mana.png", true, false, false, false, "MANA", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4", "Decentraland",
        "mana.png", true, false, false, false, "MANA", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c", "Enjin Coin", "enj.png",
        true, false, false, false, "ENJ", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x0D8775F648430679A709E98d2b0Cb6250d2887EF", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"EPeUFDgHRxs9xxEPVaL6kfGQvCon7jmAWKVUHuux1Tpz", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"", "Fantom", "", false, false, false, false, "FTM", 18, true, "", "",
        mojom::kFantomMainnetChainId, mojom::CoinType::ETH},
       {"0xC581b735A1688071A1746c968e0798D642EDE491", "Euro Tether", "eurt.png",
        true, false, false, false, "EURT", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xf411903cbc70a74d22900a5de66a2dda66507255", "Verasity", "vra.png",
        true, false, false, false, "VRA", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"", "Aurora", "aurora.png", false, false, false, false, "AURORA", 18,
        true, "", "", mojom::kAuroraMainnetChainId, mojom::CoinType::ETH},
       {"0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", "Weth", "weth.png", true,
        false, false, false, "WETH", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0xA179248E50CE5AFb507FD8C54e08A66FBAC7B6Ff", "Freedom. Jobs. Business",
        "$fjb.png", true, false, false, false, "$FJB", 18, true, "", "",
        mojom::kBinanceSmartChainMainnetChainId, mojom::CoinType::ETH},
       {"0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", "Celo Euro", "ceur.png",
        true, false, false, false, "CEUR", 18, true, "", "",
        mojom::kCeloMainnetChainId, mojom::CoinType::ETH}});

  return *tokens;
}

const std::vector<mojom::BlockchainToken>& GetRampSellTokens() {
  static base::NoDestructor<std::vector<mojom::BlockchainToken>> tokens(
      {{"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x0D8775F648430679A709E98d2b0Cb6250d2887EF", "Basic Attention Token",
        "bat.png", true, false, false, false, "BAT", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x3845badade8e6dff049820680d1f14bd3903a5d0", "The Sandbox", "sand.png",
        true, false, false, false, "SAND", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xc18360217d8f7ab5e7c516566761ea12ce7f9d72", "ENS", "ens.png", true,
        false, false, false, "ENS", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0x6B175474E89094C44Da98b954EedeAC495271d0F", "DAI", "dai.png", true,
        false, false, false, "DAI", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"0xdAC17F958D2ee523a2206206994597C13D831ec7", "Tether", "usdt.png",
        true, false, false, false, "USDT", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x514910771AF9Ca656af840dff83E8264EcF986CA", "Chainlink",
        "chainlink.png", true, false, false, false, "LINK", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0x0f5d2fb29fb7d3cfee444a200298f468908cc942", "Decentraland",
        "mana.png", true, false, false, false, "MANA", 18, true, "", "",
        mojom::kMainnetChainId, mojom::CoinType::ETH},
       {"0xf1f955016EcbCd7321c7266BccFB96c68ea5E49b", "Rally", "rly.png", true,
        false, false, false, "RLY", 18, true, "", "", mojom::kMainnetChainId,
        mojom::CoinType::ETH},
       {"", "BNB", "", false, false, false, false, "BNB", 18, true, "", "",
        mojom::kBinanceSmartChainMainnetChainId, mojom::CoinType::ETH},
       {"0xe9e7cea3dedca5984780bafc599bd69add087d56", "Binance USD", "busd.png",
        true, false, false, false, "BUSD", 18, true, "", "",
        mojom::kBinanceSmartChainMainnetChainId, mojom::CoinType::ETH},
       {"", "Celo", "", false, false, false, false, "CELO", 18, true, "", "",
        mojom::kCeloMainnetChainId, mojom::CoinType::ETH},
       {"0x765DE816845861e75A25fCA122bb6898B8B1282a", "Celo Dollar", "cusd.png",
        true, false, false, false, "CUSD", 18, true, "", "",
        mojom::kCeloMainnetChainId, mojom::CoinType::ETH},
       {"", "Polygon", "", false, false, false, false, "MATIC", 18, true, "",
        "", mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", "Ethereum", "eth.png",
        true, false, false, false, "ETH", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", "DAI Stablecoin",
        "dai.png", true, false, false, false, "DAI", 18, true, "", "",
        mojom::kPolygonMainnetChainId, mojom::CoinType::ETH},
       {"", "Avalanche", "", false, false, false, false, "AVAX", 18, true, "",
        "", mojom::kAvalancheMainnetChainId, mojom::CoinType::ETH},
       {"0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kAvalancheMainnetChainId, mojom::CoinType::ETH},
       {"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kArbitrumMainnetChainId, mojom::CoinType::ETH},
       {"", "Ethereum", "", false, false, false, false, "ETH", 18, true, "", "",
        mojom::kOptimismMainnetChainId, mojom::CoinType::ETH},
       {"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", "DAI Stablecoin",
        "dai.png", true, false, false, false, "DAI", 18, true, "", "",
        mojom::kOptimismMainnetChainId, mojom::CoinType::ETH},
       {"", "Fantom", "", false, false, false, false, "FTM", 18, true, "", "",
        mojom::kFantomMainnetChainId, mojom::CoinType::ETH},
       {"", "Solana", "", false, false, false, false, "SOL", 9, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", "Tether", "usdt.png",
        true, false, false, false, "USDT", 6, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL},
       {"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "USD Coin", "usdc.png",
        true, false, false, false, "USDC", 6, true, "", "",
        mojom::kSolanaMainnet, mojom::CoinType::SOL}});
  return *tokens;
}

const std::vector<mojom::OnRampCurrency>& GetOnRampCurrenciesList() {
  static base::NoDestructor<std::vector<mojom::OnRampCurrency>> currencies(
      {{"ARS", "Argentine Peso", {mojom::OnRampProvider::kTransak}},
       {"AUD", "Australian dollar", {mojom::OnRampProvider::kTransak}},
       {"BMD", "Bermudian Dollar", {mojom::OnRampProvider::kTransak}},
       {"BRL", "Brazilian Real", {mojom::OnRampProvider::kTransak}},
       {"GBP",
        "British pound",
        {mojom::OnRampProvider::kRamp, mojom::OnRampProvider::kTransak}},
       {"CAD", "Canadian dollar", {mojom::OnRampProvider::kTransak}},
       {"CLP", "Chilean Peso", {mojom::OnRampProvider::kTransak}},
       {"CZK", "Czech Koruna", {mojom::OnRampProvider::kTransak}},
       {"DKK", "Danish Krone", {mojom::OnRampProvider::kTransak}},
       {"DJF", "Djibouti Franc", {mojom::OnRampProvider::kTransak}},
       {"EUR",
        "Euro",
        {mojom::OnRampProvider::kRamp, mojom::OnRampProvider::kTransak}},
       {"HUF", "Forint", {mojom::OnRampProvider::kTransak}},
       {"INR", "Indian rupee", {mojom::OnRampProvider::kTransak}},
       {"IDR", "Indonesian Rupiah", {mojom::OnRampProvider::kTransak}},
       {"ILS", "Israeli Shekel", {mojom::OnRampProvider::kTransak}},
       {"JPY", "Japanese Yen", {mojom::OnRampProvider::kTransak}},
       {"MYR", "Malaysian Ringgit", {mojom::OnRampProvider::kTransak}},
       {"MXN", "Mexican peso", {mojom::OnRampProvider::kTransak}},
       {"NZD", "New Zealand dollar", {mojom::OnRampProvider::kTransak}},
       {"NOK", "Norwegian Krone", {mojom::OnRampProvider::kTransak}},
       {"PHP", "Philippine Peso", {mojom::OnRampProvider::kTransak}},
       {"PLN", "Polish Zloty", {mojom::OnRampProvider::kTransak}},
       {"SGD", "Singapore Dollar", {mojom::OnRampProvider::kTransak}},
       {"ZAR", "South African Rand", {mojom::OnRampProvider::kTransak}},
       {"KRW", "South Korean Won", {mojom::OnRampProvider::kTransak}},
       {"SEK", "Swedish krona", {mojom::OnRampProvider::kTransak}},
       {"CHF", "Swiss franc", {mojom::OnRampProvider::kTransak}},
       {"THB", "Thai Baht", {mojom::OnRampProvider::kTransak}},
       {"TRY", "Turkish Lira", {mojom::OnRampProvider::kTransak}},
       {"USD",
        "US Dollar",
        {mojom::OnRampProvider::kRamp, mojom::OnRampProvider::kTransak}}});

  return *currencies;
}

const std::string GetSardineNetworkName(const std::string& chain_id) {
  // key = chain_id, value = sardine_network_name
  static std::map<std::string, std::string> sardine_network_names = {
      {mojom::kMainnetChainId, "ethereum"},
      {mojom::kPolygonMainnetChainId, "ethereum"},
      {mojom::kAvalancheMainnetChainId, "avalanche"},
      {mojom::kFantomMainnetChainId, "fantom"},
      {mojom::kSolanaMainnet, "solana"}};
  auto sardine_network_pair = sardine_network_names.find(chain_id.c_str());

  if (sardine_network_pair == sardine_network_names.end()) {
    // not found
    return "";
  } else {
    return sardine_network_pair->second;
  }
}

const base::flat_map<std::string, std::string>& GetInfuraChainEndpoints() {
  static base::NoDestructor<base::flat_map<std::string, std::string>> endpoints(
      {{brave_wallet::mojom::kPolygonMainnetChainId,
        "https://polygon-mainnet.infura.io/v3/"},
       {brave_wallet::mojom::kOptimismMainnetChainId,
        "https://optimism-mainnet.infura.io/v3/"},
       {brave_wallet::mojom::kAuroraMainnetChainId,
        "https://aurora-mainnet.infura.io/v3/"}});

  return *endpoints;
}

const base::flat_map<std::string, std::string>&
GetEthBalanceScannerContractAddresses() {
  static base::NoDestructor<base::flat_map<std::string, std::string>>
      contract_addresses(
          // Mainnet, Polygon, and Avalanche conctract addresses pulled from
          // https://github.com/MyCryptoHQ/eth-scan
          {{mojom::kMainnetChainId,
            "0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5"},
           {mojom::kPolygonMainnetChainId,
            "0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5"},
           {mojom::kAvalancheMainnetChainId,
            "0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5"},
           // BSC, Optimism, and Arbitrum contract addresses pulled from
           // https://github.com/onyb/x/blob/75800edce88688dcfe59dd6b4a664087862369bb/core/evm/scanner/balances/EVMScanner.ts
           {mojom::kBinanceSmartChainMainnetChainId,
            "0x53242a975aa7c607e17138b0e0231162e3e68593"},
           {mojom::kOptimismMainnetChainId,
            "0x9e5076DF494FC949aBc4461F4E57592B81517D81"},
           {mojom::kArbitrumMainnetChainId,
            "0xa3e7eb35e779f261ca604138d41d0258e995e97b"}});

  return *contract_addresses;
}

bool HasJupiterFeesForTokenMint(const std::string& mint) {
  static std::vector<std::string> mints(
      {"So11111111111111111111111111111111111111112",     // wSOL
       "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",    // USDC
       "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",    // USDT
       "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",    // WETH (Wormhole)
       "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",    // ETH (Sollet)
       "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",    // BTC (Sollet)
       "qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL",     // wWBTC (Wormhole)
       "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",    // stSOL
       "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",     // mSOL
       "FYpdBuyAHSbdaAyD1sKkxyLWbAP8uUW9h6uvdhK74ij1"});  // DAI

  return base::Contains(mints, mint);
}

const std::vector<std::string>& GetEthSupportedNftInterfaces() {
  static base::NoDestructor<std::vector<std::string>> interfaces({
      kERC721InterfaceId,
      kERC1155InterfaceId,
  });

  return *interfaces;
}

}  // namespace brave_wallet
