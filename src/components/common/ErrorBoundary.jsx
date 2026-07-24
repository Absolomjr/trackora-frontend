import { Component } from "react";
import { FiAlertOctagon } from "react-icons/fi";

/**
 * App-wide error boundary. React error boundaries must be class components —
 * this is the one place we still use one. It catches render/lifecycle errors
 * anywhere below it and shows a branded fallback instead of a white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Kept for future wiring to an error-reporting service (Sentry, etc.).
    if (import.meta.env.DEV) {
      console.error("Uncaught UI error:", error, info);
    }
  }

  handleReload = () => {
    // A full reload is the safest recovery for an unknown render fault.
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">
            <FiAlertOctagon />
          </div>
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__text">
            The page hit an unexpected error. Reloading usually fixes it. If it
            keeps happening, please let us know.
          </p>
          <button className="btn btn--primary" onClick={this.handleReload}>
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
