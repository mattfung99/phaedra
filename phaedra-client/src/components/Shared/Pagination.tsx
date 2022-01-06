import CenteredContainer from './CenteredContainer';

interface Props {
  postsPerPage: number;
  totalPosts: number;
  paginate: any;
}

const Pagination = ({ postsPerPage, totalPosts, paginate }: Props) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <CenteredContainer>
      <ul className="pagination justify-content-md-center">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <p onClick={() => paginate(number)} className="page-link">
              {number}
            </p>
          </li>
        ))}
      </ul>
    </CenteredContainer>
  );
};

export default Pagination;
