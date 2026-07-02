export interface RpcEndpoint {
  address: string;
  provider?: string;
  tx_index?: string;
}

export interface ChainAsset {
  base: string;
  display?: string;
  symbol?: string;
  denom_units?: Array<{ denom: string; exponent: number }>;
}

export interface FeeToken {
  denom: string;
  fixed_min_gas_price?: number;
  low_gas_price?: number;
  average_gas_price?: number;
  high_gas_price?: number;
}

export interface ChainFees {
  fee_tokens?: FeeToken[];
}

export interface ChainData {
  chain_name: string;
  chain_id?: string;
  coin_type?: string;
  assets?: ChainAsset[];
  rpc?: RpcEndpoint[];
  evm_rpc?: RpcEndpoint[];
  evm_chain_id?: number;
  fees?: ChainFees;
}
