import React from 'react';
import {
  createPaginationContainer,
  graphql,
} from 'react-relay';

class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>Widget list</h1>
        <ul>
          {this.props.viewer.widgets.edges.map(edge =>
            <li key={edge.node.id}>{edge.node.name} (ID: {edge.node.id})</li>
          )}
        </ul>
      </div>
    );
  }
}

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
