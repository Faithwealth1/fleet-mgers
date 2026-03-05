import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveHeader from './tools/responsiveHeader';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const IndividualRequest = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <ResponsiveHeader />
      <div className="container">
        <div className="containerRequest">
          <div className="head">
            <h2>#Request - 001</h2>
          </div>
          <div className="others">
            <div className="left">
              <table>
                <thead>
                  <tr>
                    <th>Request id</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Customer name</td>
                    <td>val2</td>
                  </tr>
                  <tr>
                    <td>Date requested</td>
                    <td>val2</td>
                  </tr>
                  <tr>
                    <td>Date completed</td>
                    <td>val2</td>
                  </tr>
                </tbody>
              </table>
              <div className="requestSummary">
                <div>Request:</div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam recusandae eius eveniet
                  temporibus magni nemo iste consequuntur consectetur. Suscipit reprehenderit illum molestiae maiores
                  quod asperiores hic amet repellendus recusandae quae? Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Earum veritatis nam omnis iste esse eligendi dolorum iusto ea neque sequi,
                  provident vitae voluptatem! Fugit blanditiis consequuntur tempora minima a exercitationem!
                </p>
              </div>
            </div>
            <div className="right">
              <div className="requestIntro">
                <div className="img">
                  <img src="vite.svg" alt="" />
                </div>
                <div className="name">name</div>
                <div className="role">role</div>
                <div className="number">number</div>
                <div className="number">star ratings</div>
              </div>
              <div className="requestOther">
                {[...Array(4)].map((_, index) => (
                  <div className="indiv" key={index}>
                    <div className="title">Title</div>
                    <div className="subTitle">subTitle</div>
                  </div>
                ))}
              </div>
              <div className="reviews">
                <div className="revHead">Reviews</div>
                {[...Array(4)].map((_, index) => (
                  <div className="indiv" key={index}>
                    <div className="review">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores sequi aperiam placeat, amet
                      perspiciatis sit. Vitae fugit excepturi maiores eum est. Eius, a! Facilis ut et quaerat, sit
                      ipsum aliquid.
                    </div>
                    <div className="author">- Mark</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualRequest;
