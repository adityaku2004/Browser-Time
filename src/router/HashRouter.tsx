import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode, ReactElement } from 'react';

interface LocationState {
  pathname: string;
  hash: string;
}

interface NavigateOptions {
  replace?: boolean;
}

interface RouterContextValue {
  location: LocationState;
  navigate: (to: string, options?: NavigateOptions) => void;
  outlet: ReactNode;
}

const RouterContext = createContext<RouterContextValue>({
  location: { pathname: '/', hash: '' },
  navigate: () => {},
  outlet: null,
});

function parseHashLocation(): LocationState {
  if (typeof window === 'undefined') {
    return { pathname: '/', hash: '' };
  }
  const rawHash = window.location.hash;
  if (!rawHash || rawHash === '#') {
    return { pathname: '/', hash: rawHash };
  }
  const stripped = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
  const pathname = stripped.startsWith('/') ? stripped : `/${stripped}`;
  return { pathname, hash: rawHash };
}

function normalizePath(path: string): string {
  if (!path) return '/';
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return cleaned.length > 1 && cleaned.endsWith('/') ? cleaned.slice(0, -1) : cleaned;
}

export const HashRouter: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationState>(() => parseHashLocation());

  useEffect(() => {
    if (!window.location.hash) {
      window.location.replace('#/');
    }

    const handleHashChange = () => {
      setLocation(parseHashLocation());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((to: string, options?: NavigateOptions) => {
    const target = normalizePath(to);
    const nextHash = `#${target}`;
    if (options?.replace) {
      window.location.replace(nextHash);
    } else {
      window.location.hash = nextHash;
    }
    setLocation({ pathname: target, hash: nextHash });
  }, []);

  return (
    <RouterContext.Provider value={{ location, navigate, outlet: null }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useLocation(): LocationState {
  return useContext(RouterContext).location;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export const Outlet: React.FC = () => {
  return <>{useContext(RouterContext).outlet}</>;
};

export interface RouteProps {
  path?: string;
  index?: boolean;
  element?: ReactNode;
  children?: ReactNode;
}

export const Route: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};

function joinPaths(parentPath: string, childPath?: string): string {
  if (!childPath) return normalizePath(parentPath);
  if (childPath === '*') return '*';
  const base = parentPath === '/' ? '' : normalizePath(parentPath);
  const sub = childPath.startsWith('/') ? childPath : `/${childPath}`;
  return normalizePath(`${base}${sub}`);
}

export const Routes: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ctx = useContext(RouterContext);
  const currentPath = normalizePath(ctx.location.pathname);

  const routeElements = React.Children.toArray(children).filter(React.isValidElement) as ReactElement<RouteProps>[];

  for (const routeEl of routeElements) {
    const { path = '/', element, children: nestedChildren } = routeEl.props;

    if (nestedChildren) {
      const childRoutes = React.Children.toArray(nestedChildren).filter(React.isValidElement) as ReactElement<RouteProps>[];
      let matchedChild: ReactNode = null;
      let wildcardChild: ReactNode = null;

      for (const childEl of childRoutes) {
        if (childEl.props.index) {
          if (currentPath === normalizePath(path)) {
            matchedChild = childEl.props.element ?? null;
            break;
          }
        } else if (childEl.props.path === '*') {
          wildcardChild = childEl.props.element ?? null;
        } else {
          const fullChildPath = joinPaths(path, childEl.props.path);
          if (currentPath === fullChildPath) {
            matchedChild = childEl.props.element ?? null;
            break;
          }
        }
      }

      const outletNode = matchedChild ?? wildcardChild;
      if (outletNode !== null) {
        return (
          <RouterContext.Provider value={{ ...ctx, outlet: outletNode }}>
            {element}
          </RouterContext.Provider>
        );
      }
    } else if (path === '*' || normalizePath(path) === currentPath) {
      return <>{element}</>;
    }
  }

  return null;
};

export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
};

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, onClick, children, ...rest }) => {
  const navigate = useNavigate();
  const target = normalizePath(to);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(target);
    }
  };

  return (
    <a href={`#${target}`} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> {
  to: string;
  className?: string | ((props: { isActive: boolean }) => string);
  children: ReactNode;
}

export const NavLink: React.FC<NavLinkProps> = ({ to, className, onClick, children, ...rest }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const target = normalizePath(to);
  const isActive = normalizePath(location.pathname) === target;

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(target);
    }
  };

  return (
    <a href={`#${target}`} onClick={handleClick} className={resolvedClassName} {...rest}>
      {children}
    </a>
  );
};
