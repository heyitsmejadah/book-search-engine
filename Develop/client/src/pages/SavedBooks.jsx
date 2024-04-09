import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const tokenData = Auth.getProfile();

  const { data } = useQuery(GET_ME, {
    variables: { _id: tokenData.data._id },
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!data) {
          throw new Error("Something went wrong!");
        }

        const user = data.me;
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserData();
  }, [data]);

  const handleDeleteBook = (bookId) => {
    // Handle book deletion logic here
  };

  return (
    <>
      <div>
        <Container>
          <h2 className="pt-5">Saved Books</h2>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks && userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks &&
            userData.savedBooks.map((book) => {
              return (
                <Col md="4" key={book.bookId}>
                  <Card border="dark">
                    {book.image && (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{book.title}</Card.Title>
                      <p className="small">Authors: {book.authors}</p>
                      <Card.Text>{book.description}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteBook(book.bookId)}
                      >
                        Delete this Book!
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
