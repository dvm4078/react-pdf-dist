import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import * as PdfJs from "pdfjs-dist";
import { FixedSizeList as Document } from "react-window";

import DocumentView from "./DocumentView.js";
import DocumentSize from "./DocumentMeasure";

import styles from "./styles.module.css";

class App extends React.Component {
  static displayName = "Viewer";

  static propTypes = {
    initialScrollOffset: PropTypes.number
  };

  static defaultProps = {
    initialScrollOffset: 0
  };

  state = {
    documentBody: {},
    documentSize: {
      width: 0,
      height: 0
    },
    documentZoom: 0.75,
    scrollOffset: this.props.initialScrollOffset
  };

  documentContainer = React.createRef();
  document = React.createRef();
  scroller = React.createRef();

  componentDidMount() {
    const { documentZoom } = this.state;

    PdfJs.getDocument(
      "https://uploads.codesandbox.io/uploads/user/faa4155a-f802-458d-81ad-90b4709d0cf8/4ETB-10.1.1.324.5566.pdf"
    ).then(pdf => {
      pdf.getPage(1).then(page => {
        /**
         * Get size of the first page for total document size estmation.
         */
        const { width, height } = page.getViewport(documentZoom);

        this.setState({
          documentBody: pdf,
          documentSize: {
            width,
            height
          }
        });
      });
    });
  }

  handleDocumentScroll = ({
    scrollDirection,
    scrollOffset,
    scrollUpdateWasRequested
  }) => {
    this.setState({ scrollOffset });
  };

  render() {
    const { initialScrollOffset } = this.props;
    const {
      documentBody,
      documentZoom,
      documentSize
      // scrollOffset
    } = this.state;
    const { numPages } = documentBody;
    const { height: pageHeight } = documentSize;

    return (
      <div
        className={styles.viewer}
        tabIndex={0}
        style={{ width: "460px", height: "600px" }}
      >
        <div className={styles.content}>
          <div className={styles.document} ref={this.documentContainer}>
            {this.documentContainer.current && (
              <DocumentSize>
                {({ width, height }) => (
                  <Document
                    className={styles.scroller}
                    ref={this.scroller}
                    innerRef={this.document}
                    initialScrollOffset={initialScrollOffset}
                    height={height}
                    width={width}
                    itemCount={numPages}
                    itemData={{ documentBody, documentZoom }}
                    itemSize={pageHeight}
                    onScroll={this.handleDocumentScroll}
                  >
                    {DocumentView}
                  </Document>
                )}
              </DocumentSize>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
