import React from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Alerta from "./Alerta";
import Spinner from "./Spinner";

const Formulario = ({ cliente, cargando }) => {
    const navigate = useNavigate();

    const nuevoClienteSchema = Yup.object().shape({
        nombre: Yup.string()
            .min(3, "El nombre es muy corto")
            .max(30, "El nombre es muy largo")
            .required("El nombre del cliente es obligatorio"),
        empresa: Yup.string().required("El nombre de empresa es obligatorio"),
        email: Yup.string()
            .email("Email no válido")
            .required("El email es obligatorio"),
        telefono: Yup.number()
            .integer("Telefono no válido")
            .positive("Telefono no válido")
            .typeError("Número de telefono válido"),
        notas: Yup.string()
            .min(3, "La nota es muy corta")
            .max(300, "La nota es muy larga, solo 300 caracteres"),
    });
    const handleSubmit = async (valores) => {
        try {
            let respuesta;
            if (cliente.id) {
                // Update
                const url = `${import.meta.env.VITE_API_URL}/${cliente.id}`;
                console.log(url);
                respuesta = await fetch(url, {
                    method: "PUT",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            } else {
                // Register
                const url = `${import.meta.env.VITE_API_URL}`;
                console.log(url);
                respuesta = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(valores),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            // console.log(respuesta);
            await respuesta.json();
            navigate("/clientes");
        } catch (error) {
            console.log(error);
        }
    };
    return cargando ? (
        <Spinner />
    ) : (
        // Object.keys(cliente).length === 0 ? <p>No hay resultados</p> :
        <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto">
            <h1 className="text-gray-600 font-bold text-xl uppercase text-center">
                {cliente?.nombre ? "Editar cliente" : "Agregar Cliente"}
            </h1>
            <Formik
                initialValues={{
                    nombre: cliente?.nombre ?? "",
                    empresa: cliente?.empresa ?? "",
                    email: cliente?.email ?? "",
                    telefono: cliente?.telefono ?? "",
                    notas: cliente?.notas ?? "",
                }}
                enableReinitialize={true}
                onSubmit={async (values, { resetForm }) => {
                    await handleSubmit(values);
                    resetForm();
                }}
                validationSchema={nuevoClienteSchema}
            >
                {({ errors, touched }) => {
                    // console.log(data)
                    return (
                        <Form className="mt-10">
                            <div className="mb-4">
                                <label
                                    className="text-gray-800"
                                    htmlFor="nombre"
                                >
                                    Nombre:
                                </label>
                                <Field
                                    id="nombre"
                                    type="text"
                                    className="mt-2 block w-full p-3 bg-gray-50"
                                    placeholder="Nombre de cliente"
                                    name="nombre"
                                />
                                {errors.nombre && touched.nombre ? (
                                    <Alerta>{errors.nombre}</Alerta>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="text-gray-800"
                                    htmlFor="empresa"
                                >
                                    Empresa:
                                </label>
                                <Field
                                    id="empresa"
                                    type="text"
                                    className="mt-2 block w-full p-3 bg-gray-50"
                                    placeholder="Empresa de cliente"
                                    name="empresa"
                                />
                                {errors.empresa && touched.empresa ? (
                                    <Alerta>{errors.empresa}</Alerta>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="text-gray-800"
                                    htmlFor="email"
                                >
                                    Email:
                                </label>
                                <Field
                                    id="email"
                                    type="email"
                                    className="mt-2 block w-full p-3 bg-gray-50"
                                    placeholder="Email de cliente"
                                    name="email"
                                />
                                {errors.email && touched.email ? (
                                    <Alerta>{errors.email}</Alerta>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="text-gray-800"
                                    htmlFor="telefono"
                                >
                                    Teléfono:
                                </label>
                                <Field
                                    id="telefono"
                                    type="tel"
                                    className="mt-2 block w-full p-3 bg-gray-50"
                                    placeholder="Teléfono de cliente"
                                    name="telefono"
                                />
                                {errors.telefono && touched.telefono ? (
                                    <Alerta>{errors.telefono}</Alerta>
                                ) : null}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="text-gray-800"
                                    htmlFor="notas"
                                >
                                    Notas:
                                </label>
                                <Field
                                    as="textarea"
                                    id="notas"
                                    type="text"
                                    className="mt-2 block w-full p-3 bg-gray-50 h-40"
                                    placeholder="Notas de cliente"
                                    name="notas"
                                />
                                {errors.notas && touched.notas ? (
                                    <Alerta>{errors.notas}</Alerta>
                                ) : null}
                            </div>
                            <input
                                type="submit"
                                className="mt-5 w-full bg-blue-800 p-3 text-white font-bold uppercase text-lg rounded-md :hover cursor-pointer"
                                value={
                                    cliente?.nombre
                                        ? "Editar cliente"
                                        : "Agregar Cliente"
                                }
                            />
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

Formulario.defaultProps = {
    cliente: {},
    cargando: false,
};

export default Formulario;
