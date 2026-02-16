import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { Person } from '../../../types';
import { getPeople } from '../../../api';
import { PersonLink } from '../PersonLink';
import { useParams } from 'react-router-dom';

export const PeoplePage: React.FC = () => {
  const [peoples, setPeoples] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMassage, setErrorMessage] = useState<string | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    getPeople()
      .then(data => setPeoples(data))
      .catch(() => setErrorMessage('Something went wrong'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="block">
        <div className="box table-container">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {errorMassage && (
                <p data-cy="peopleLoadingError" className="has-text-danger">
                  Something went wrong
                </p>
              )}

              {peoples.length === 0 && (
                <p data-cy="noPeopleMessage">
                  There are no people on the server
                </p>
              )}
              {!isLoading && (
                <table
                  data-cy="peopleTable"
                  className="
                  table is-striped is-hoverable is-narrow is-fullwidth
                  "
                >
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Sex</th>
                      <th>Born</th>
                      <th>Died</th>
                      <th>Mother</th>
                      <th>Father</th>
                    </tr>
                  </thead>

                  <tbody>
                    {peoples.map(people => {
                      const mother = peoples.find(
                        p => p.name === people.motherName,
                      );

                      const father = peoples.find(
                        p => p.name === people.fatherName,
                      );

                      return (
                        <tr
                          data-cy="person"
                          key={people.slug}
                          className={
                            slug === people.slug ? 'has-background-warning' : ''
                          }
                        >
                          <td>
                            <PersonLink person={people} />
                          </td>

                          <td>{people.sex}</td>
                          <td>{people.born}</td>
                          <td>{people.died}</td>
                          <td>
                            {mother ? (
                              <PersonLink person={mother} />
                            ) : people.motherName ? (
                              people.motherName
                            ) : (
                              '-'
                            )}
                          </td>
                          <td>
                            {father ? (
                              <PersonLink person={father} />
                            ) : people.fatherName ? (
                              people.fatherName
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
