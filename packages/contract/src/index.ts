/** What the host passes when it mounts a remote. */
export interface MountOptions {
  /** The host's current path, used as the remote's first route. */
  initialPath?: string;
  /** Called when the remote navigates on its own, so the host can follow. */
  onNavigate?: (pathname: string) => void;
  /** True when the remote runs on its own page and owns the browser URL. */
  standalone?: boolean;
}

/** What a mounted remote hands back to the host. */
export interface MountedApp {
  unmount(): void;
  /** Moves the remote to the host's new path. Absent for remotes without routing. */
  onHostNavigate?(pathname: string): void;
}

/** The single export every remote exposes as `./mount`. */
export type Mount<Props extends object = object> = (
  element: HTMLElement,
  options?: MountOptions & Props,
) => MountedApp;

/** Extra options the Auth remote needs. */
export interface AuthProps {
  onSignIn: () => void;
}
