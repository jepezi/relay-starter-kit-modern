import 'isomorphic-fetch';
import "babel-polyfill";

import Root from "./Root";
import React from "react";
import ReactDOM from "react-dom";
import { QueryRenderer, graphql } from "react-relay";
import {
  Environment,
  Network,
  RecordSource,
  Store,
  ConnectionHandler,
  ViewerHandler
} from "relay-runtime";

function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables,
) {
  return fetch('/graphql', {
    method: 'POST',
    headers: {}, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}
const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);
function handlerProvider(handle) {
  switch (handle) {
    case "connection":
      return ConnectionHandler;
    case "viewer":
      return ViewerHandler;
  }
  throw new Error(`handlerProvider: No handler provided for ${handle}`);
}

const environment = new Environment({
  handlerProvider,
  network,
  store
});

ReactDOM.render(
  <QueryRenderer
    environment={environment}
    query={
      graphql`
        query AppQuery(
          $count: Int!
        ) {
          viewer {
            name
            email
            widgets(
              first: $count
            ) @connection(key: "App_widgets") {
              edges {
                node {
                  id,
                  name,
                },
              },
            }
          }
        }
      `
    }
    variables={{
      count: 10,
    }}
    render={({ error, props }) => {
      if (error) {
        console.warn('error', error.source);
        return <div>{error.message}</div>;
      } else if (props) {
        console.warn('props', props);
        return <div>yay</div>;
      }
      return <div>Loading</div>;
    }}
  />,
  document.getElementById("root")
);

// ReactDOM.render(
//   <QueryRenderer
//     environment={environment}
//     query={
//       graphql`
//       query AppQuery(
//         $cursor: ID
//         $count: Int!
//       ) {
//         viewer {
//           name
//           email
//           ...Root_viewer
//         }
//       }
//     `
//     }
//     variables={{
//       count: 10,
//       cursor: null,
//     }}
//     render={({ error, props }) => {
//       if (error) {
//         console.warn('error', error);
//         return <div>{error.message}</div>;
//       } else if (props) {
//         console.warn('---- props -----');
//         console.warn(props);
//         return <Root viewer={props.viewer} />;
//       }
//       return <div>Loading</div>;
//     }}
//   />,
//   document.getElementById("root")
// );

// Root.js
// --------------------------------------------
// import React from 'react';
// import {
//   createPaginationContainer,
//   graphql,
// } from 'react-relay';
//
// class Root extends React.Component {
//   render() {
//     return (
//       <div>
//         <h1>Widget list</h1>
//         <ul>
//           {this.props.viewer.widgets.edges.map(edge =>
//             <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
//           )}
//         </ul>
//       </div>
//     );
//   }
// }
//
// export default createPaginationContainer(
//   Root,
//   {
//     viewer: graphql`
//       fragment Root_viewer on User {
//         widgets(
//           first: $count
//         ) @connection(key: "Root_widgets") {
//           edges {
//             node {
//               id,
//               name,
//             },
//           },
//         }
//       }
//     `,
//   },
//   {
//     getFragmentVariables(prevVars, totalCount) {
//       return {
//         ...prevVars,
//         count: totalCount,
//       };
//     },
//     getVariables(props, {count, cursor}, fragmentVariables) {
//       return {
//         count,
//         cursor,
//         // in most cases, for variables other than connection filters like
//         // `first`, `after`, etc. you may want to use the previous values.
//         // orderBy: fragmentVariables.orderBy,
//       };
//     },
//     query: graphql`
//       query RootPaginationQuery(
//         $count: Int!
//       ) {
//         viewer {
//           # You could reference the fragment defined previously.
//           ...Root_viewer
//         }
//       }
//     `
//   }
// );
