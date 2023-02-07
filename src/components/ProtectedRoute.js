import React from 'react';
import {Navigate} from "react-router-dom";

const ProtectedRouteElement = ({element: Component, ...props}) => {
    return (
        props.loggedIn ? <Component {...props} /> : <Navigate to="/sign-in" replace/>
    )
};

export default ProtectedRouteElement;

// Было бы избыточно добавлять логику проверки и переадресации в каждый компонент,
// поэтому расположим её в одном месте. Для этого понадобится компонент более высокого порядка.
// НОС позволяет добавить функциональность одному или нескольким компонентам.
// Если компоненты нуждаются в общей функциональности, можно обернуть их в HOC и описать в нём всё, что нужно.
// В больших проектах компоненты более высокого порядка позволяют лучше структурировать код и сделать его понятнее.
// function ProtectedRouteElement({  loggedIn, children}) {
// //     if (!loggedIn) {
// //         return <Navigate to="/sign-in" />;
// //     } else {
// //
// //         return children;
// //     }
// // }