declare namespace IPFS {
  export interface ApplicationState {
    ipfsData: State | undefined
  }

  export interface State {
    connectedPeers: ConnectedPeers
    addressesConfig: AddressesConfig
    daemonStatus: DaemonStatus
    repoStats: RepoStats,
    nodeInfo: NodeInfo,
    garbageCollectionStatus: GarbageCollectionStatus,
    installationProgress: InstallationProgress
  }

  export interface ConnectedPeers {
    peerCount: number
  }

  export interface AddressesConfig {
    api: string
    gateway: string
    swarm: string[]
  }

  export interface DaemonStatus {
    installed: boolean
    launched: boolean
    restarting: boolean
    installing: boolean
    error: string
  }

  export interface GarbageCollectionStatus {
    success: boolean
    error: string
    started: boolean
  }

  export interface RepoStats {
    objects: number
    size: number
    storage: number
    path: string
    version: string
  }

  export interface NodeInfo {
    id: string
    version: string
    component_version: string
  }

  export interface InstallationProgress {
    total_bytes: number
    downloaded_bytes: number
  }

}
