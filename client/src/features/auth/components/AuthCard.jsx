import React from "react";

const AuthCard = ({ title, subtitle, children }) => {
  return (
    <main>
      <section>
        <div>
          <h1>{title}</h1>

          {subtitle ? <p>{subtitle}</p> : null}
        </div>

        {children}
      </section>
    </main>
  );
};

export default AuthCard;
