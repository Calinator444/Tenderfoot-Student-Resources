import { React, useEffect, useState } from "react";
import { Row, Container, Col, Button, Toast, Modal } from "react-bootstrap";
//import { doStuff } from "./SharedFunctions";
import Mainnav from "./reactcomponents/Mainnav";
import background from "./resources/bg.jpg";
import axios from "axios";

function Home() {
  const handleSubmit = async () => {
    console.log("handlesubmit fired");
    let request = await axios
      .post("http://localhost:3001/api/addcomment", {
        body: JSON.stringify(comment),
      })
      .then((response) => {
        setCommentError(response.data);
        //console.log(response.data)
        console.log(" handleSubmit axios function complete");
      });
    await request;
    await getComments();
    console.log("end of handleSubmit");
  };
  const [comment, setComment] = useState("");

  var [commentError, setCommentError] = useState(false);
  var [comments, setComments] = useState([]);

  //used to update the datasource for the comment section;fh
  const getComments = async () => {
    let request = axios
      .get("http://localhost:3001/api/selectcomments")
      .then((res) => {
        setComments(res.data);
        console.log(res.data);
        //console.log(res.data);
        //console.log("end of axios request");
      });
    await request;
    console.log("getComments complete");
    //console.log("end of function");
  };

  useEffect(() => {
    //axios.get("http://localhost:3001/api/selectcomments").then((res)=>{
    //	setComments(res.data);
    //});
    getComments();

    //console.log(num);
  }, []);
  return (
    //background image
    <div style={{ backgroundImage: `url(${background})`, height: "100vh" }}>
      <Mainnav />
      <div style={{ backgroundColor: "#FFFFFF", marginTop: "20vh" }}>
        <Modal show={commentError}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            A comment you submitted went against our terms of service and has
            been flagged for moderation
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setCommentError(false);
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Container>
          <Row md={12}>
            <Col>
              <h1>Comment test</h1>

              {comments.map((val) => {
                //const commentBody = val.innerContent.substring(1, innerContent.length)
                var commentBody = val.innerContent;

                //I'm not sure why an offset of -1 is required here
                commentBody = commentBody.substring(1, commentBody.length - 1);

                //the "substr" is used because comments inserted with JSON.stringify contain quotations that we don't want
                //console.log("length of comment: "+commentBody.length)
                //console.log("comment"+commentBody)
                return (
                  <Row>
                    <Col md={6} className="mb-2">
                      <Toast key={val.id}>
                        <Toast.Header closeButton={false}>
                          <strong className="me-auto">test-user1</strong>
                          <small>recent</small>
                        </Toast.Header>
                        <Toast.Body>{commentBody}</Toast.Body>
                      </Toast>
                    </Col>
                  </Row>
                );
              })}
              <Row>
                <Col>
                  <h2>leave a comment: </h2>
                </Col>
              </Row>
              <Row>
                <Col>
                  <textarea
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    submit
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default Home;
