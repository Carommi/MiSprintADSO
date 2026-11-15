
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  Keyboard
} from 'react-native';

export default function App() {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Análisis');
  const [tareas, setTareas] = useState([]);
  const entradaAnimada = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animacionEntrada = Animated.timing(entradaAnimada, {
      toValue: 1,
      duration: 650,
      useNativeDriver: true
    });

    animacionEntrada.start();

    return () => animacionEntrada.stop();
  }, [entradaAnimada]);

  const categorias = ['Análisis', 'Diseño', 'Código'];

  // HU03 y HU04: Registrar y validar tareas
  const agregarTarea = () => {
    if (titulo.trim() === '') {
      const mensaje = 'Por favor, escribe el título de la tarea.';

      if (typeof globalThis.alert === 'function') {
        globalThis.alert(`Campo obligatorio\n\n${mensaje}`);
      } else {
        Alert.alert('Campo obligatorio', mensaje);
      }
      return;
    }

    const nuevaTarea = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      estado: 'Pendiente'
    };

    setTareas([...tareas, nuevaTarea]);
    setTitulo('');
    Keyboard.dismiss();
  };

  // HU06: Cambiar el estado de una tarea
  const cambiarEstado = (id) => {
    const tareasActualizadas = tareas.map((tarea) => {
      if (tarea.id === id) {
        return {
          ...tarea,
          estado:
            tarea.estado === 'Pendiente'
              ? 'Completada'
              : 'Pendiente'
        };
      }

      return tarea;
    });

    setTareas(tareasActualizadas);
  };

  // HU07: Eliminar una tarea
  const eliminarTarea = (id) => {
    const confirmarEliminacion = () => {
      setTareas(tareas.filter((tarea) => tarea.id !== id));
    };

    if (typeof globalThis.confirm === 'function') {
      const confirmada = globalThis.confirm(
        'Eliminar tarea\n\n¿Estás segura de que deseas eliminar esta tarea?'
      );

      if (confirmada) {
        confirmarEliminacion();
      }

      return;
    }

    Alert.alert(
      'Eliminar tarea',
      '¿Estás segura de que deseas eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: confirmarEliminacion
        }
      ]
    );
  };

  // HU08: Calcular indicadores del sprint
  const total = tareas.length;

  const pendientes = tareas.filter(
    (tarea) => tarea.estado === 'Pendiente'
  ).length;

  const completadas = tareas.filter(
    (tarea) => tarea.estado === 'Completada'
  ).length;

  // HU05: Mostrar cada tarea en FlatList
  const renderizarTarea = ({ item }) => (
    <View style={styles.tarjetaTarea}>
      <View style={styles.informacionTarea}>
        <Text
          style={[
            styles.tituloTarea,
            item.estado === 'Completada' && styles.tareaCompletada
          ]}
        >
          {item.titulo}
        </Text>

        <Text style={styles.categoriaTarea}>
          Categoría: {item.categoria}
        </Text>

        <Text
          style={[
            styles.estadoTarea,
            item.estado === 'Completada'
              ? styles.estadoCompletado
              : styles.estadoPendiente
          ]}
        >
          {item.estado}
        </Text>
      </View>

      <View style={styles.botonesTarea}>
        <Pressable
          style={({ pressed }) => [styles.botonEstado, pressed && styles.botonPresionado]}
          onPress={() => cambiarEstado(item.id)}
        >
          <Text style={styles.textoBotonEstado}>
            {item.estado === 'Pendiente' ? 'Completar' : 'Reactivar'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.botonEliminar, pressed && styles.botonEliminarPresionado]}
          onPress={() => eliminarTarea(item.id)}
        >
          <Text style={styles.textoBotonEliminar}>
            Eliminar
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.contenedor}>
      <StatusBar
        backgroundColor="#F8F1E8"
        barStyle="dark-content"
      />

      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={renderizarTarea}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listaContenido}
        ListHeaderComponent={
          <Animated.View
            style={[
              styles.contenidoAnimado,
              {
                opacity: entradaAnimada,
                transform: [{
                  translateY: entradaAnimada.interpolate({
                    inputRange: [0, 1],
                    outputRange: [14, 0]
                  })
                }]
              }
            ]}
          >
            {/* HU01: Identidad de la aplicación */}
            <View style={styles.encabezado}>
              <View pointerEvents="none" style={styles.orbeDecorativoGrande} />
              <View pointerEvents="none" style={styles.orbeDecorativoPequeno} />
              <Text style={styles.etiqueta}>
                SENA · ADSO
              </Text>

              <Text style={styles.tituloPrincipal}>
                Mi Sprint ADSO
              </Text>

              <Text style={styles.subtitulo}>
                Organiza tus tareas, alcanza tus metas.
              </Text>

              <View style={styles.perfil}>
                <Text style={styles.nombre}>
                  Aprendiz: Carommi
                </Text>

                <Text style={styles.ficha}>
                  Ficha: 3409609
                </Text>
              </View>
            </View>

            {/* HU08: Resumen de avance */}
            <Text style={styles.tituloSeccion}>
              Resumen de mi sprint
            </Text>

            <View style={styles.resumen}>
              <View style={styles.tarjetaResumen}>
                <Text style={styles.numeroResumen}>{total}</Text>
                <Text style={styles.textoResumen}>Total</Text>
              </View>

              <View style={styles.tarjetaResumen}>
                <Text style={styles.numeroResumen}>{pendientes}</Text>
                <Text style={styles.textoResumen}>Pendientes</Text>
              </View>

              <View style={styles.tarjetaResumen}>
                <Text style={styles.numeroResumen}>{completadas}</Text>
                <Text style={styles.textoResumen}>Completadas</Text>
              </View>
            </View>

            {/* HU02 y HU03: Formulario de tareas */}
            <Text style={styles.tituloSeccion}>
              Nueva tarea
            </Text>

            <View style={styles.formulario}>
              <Text style={styles.etiquetaCampo}>
                ¿Qué necesitas hacer?
              </Text>

              <TextInput
                style={styles.entrada}
                placeholder="Escribe el nombre de tu tarea..."
                placeholderTextColor="#A99A8C"
                value={titulo}
                onChangeText={setTitulo}
              />

              <Text style={styles.etiquetaCampo}>
                Selecciona una categoría
              </Text>

              <View style={styles.categorias}>
                {categorias.map((item) => (
                  <Pressable
                    key={item}
                    style={({ pressed }) => [
                      styles.botonCategoria,
                      categoria === item && styles.categoriaSeleccionada,
                      pressed && styles.botonPresionado
                    ]}
                    onPress={() => setCategoria(item)}
                  >
                    <Text
                      style={[
                        styles.textoCategoria,
                        categoria === item && styles.textoCategoriaSeleccionada
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={({ pressed }) => [styles.botonAgregar, pressed && styles.botonAgregarPresionado]}
                onPress={agregarTarea}
              >
                <Text style={styles.textoBotonAgregar}>
                  + Agregar tarea
                </Text>
              </Pressable>
            </View>

            {/* HU05: Lista de tareas */}
            <Text style={styles.tituloSeccion}>
              Mis tareas
            </Text>
          </Animated.View>
        }
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.iconoVacio}>✦</Text>
            <Text style={styles.textoVacio}>
              Todavía no tienes tareas.
            </Text>
            <Text style={styles.descripcionVacio}>
              ¡Agrega tu primera actividad y comienza tu sprint!
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.pie}>
        <Text style={styles.textoPie}>
          Mi Sprint ADSO · Ficha 3409609
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#F8F1E8'
  },

  contenidoAnimado: {
    width: '100%'
  },

  listaContenido: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20
  },

  encabezado: {
    backgroundColor: '#824C3B',
    paddingHorizontal: 23,
    paddingVertical: 21,
    borderRadius: 24,
    marginTop: 6,
    marginBottom: 27,
    borderWidth: 1,
    borderColor: '#9C6C5A',
    shadowColor: '#55372D',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
    overflow: 'hidden',
    borderBottomRightRadius: 52
  },

  orbeDecorativoGrande: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -68,
    top: -72,
    backgroundColor: '#A87963',
    opacity: 0.2
  },

  orbeDecorativoPequeno: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    right: 30,
    top: 24,
    backgroundColor: '#EAD5CB',
    opacity: 0.12
  },

  etiqueta: {
    color: '#EAD5CB',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4
  },

  tituloPrincipal: {
    color: '#FFFCF8',
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: -0.7,
    marginTop: 8
  },

  subtitulo: {
    color: '#F1E5D9',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },

  perfil: {
    borderTopWidth: 1,
    borderTopColor: '#A87963',
    marginTop: 15,
    paddingTop: 11,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 7
  },

  nombre: {
    color: '#FFFCF8',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2
  },

  ficha: {
    color: '#F1E5D9',
    fontSize: 11,
    backgroundColor: '#704333',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 1
  },

  tituloSeccion: {
    color: '#55372D',
    fontFamily: 'serif',
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: -0.15,
    marginBottom: 14,
    marginTop: 4
  },

  resumen: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 27
  },

  tarjetaResumen: {
    flex: 1,
    minWidth: 0,
    backgroundColor: '#FFFCF8',
    borderRadius: 18,
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2D7',
    shadowColor: '#55372D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2
  },

  numeroResumen: {
    color: '#824C3B',
    fontFamily: 'serif',
    fontSize: 29,
    fontWeight: '600',
    letterSpacing: -0.5
  },

  textoResumen: {
    color: '#8D7669',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center'
  },

  formulario: {
    backgroundColor: '#FFFCF8',
    padding: 18,
    borderRadius: 21,
    marginBottom: 27,
    borderWidth: 1,
    borderColor: '#E8D7CA',
    borderTopWidth: 3,
    shadowColor: '#55372D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2
  },

  etiquetaCampo: {
    color: '#55372D',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.15,
    marginBottom: 9
  },

  entrada: {
    backgroundColor: '#FBF7F2',
    borderWidth: 1,
    borderColor: '#EAD9CC',
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: '#55372D',
    marginBottom: 19
  },

  categorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 21
  },

  botonCategoria: {
    flex: 1,
    minWidth: 84,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: '#F1E5D9',
    borderWidth: 1,
    borderColor: '#EAD8CA',
    alignItems: 'center'
  },

  categoriaSeleccionada: {
    backgroundColor: '#824C3B',
    borderColor: '#824C3B'
  },

  textoCategoria: {
    color: '#755748',
    fontSize: 12,
    fontWeight: '600'
  },

  textoCategoriaSeleccionada: {
    color: '#FFFFFF'
  },

  botonAgregar: {
    backgroundColor: '#824C3B',
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#55372D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 3
  },

  botonAgregarPresionado: {
    backgroundColor: '#6F3E30',
    opacity: 0.94
  },

  textoBotonAgregar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.25
  },

  tarjetaTarea: {
    backgroundColor: '#FFFCF8',
    borderRadius: 19,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#F0E2D7',
    borderLeftWidth: 4,
    borderLeftColor: '#A87963',
    shadowColor: '#55372D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.055,
    shadowRadius: 8,
    elevation: 2
  },

  informacionTarea: {
    marginBottom: 15,
    gap: 7
  },

  tituloTarea: {
    color: '#55372D',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700'
  },

  tareaCompletada: {
    textDecorationLine: 'line-through',
    color: '#998A80'
  },

  categoriaTarea: {
    color: '#80695C',
    backgroundColor: '#F5ECE4',
    fontSize: 11,
    fontWeight: '600',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },

  estadoTarea: {
    fontSize: 10,
    fontWeight: '700',
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14
  },

  estadoPendiente: {
    color: '#824C3B',
    backgroundColor: '#F1E5D9'
  },

  estadoCompletado: {
    color: '#6E5145',
    backgroundColor: '#EAD5CB'
  },

  botonesTarea: {
    flexDirection: 'row',
    gap: 9,
    flexWrap: 'wrap'
  },

  botonEstado: {
    flex: 1,
    minWidth: 110,
    backgroundColor: '#EAD5CB',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 13,
    alignItems: 'center'
  },

  botonPresionado: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }]
  },

  textoBotonEstado: {
    color: '#55372D',
    fontSize: 12,
    fontWeight: '700'
  },

  botonEliminar: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#F7F0EA',
    borderWidth: 1,
    borderColor: '#EAD9CC',
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: 13,
    alignItems: 'center'
  },

  botonEliminarPresionado: {
    backgroundColor: '#EAD5CB',
    opacity: 0.8
  },

  textoBotonEliminar: {
    color: '#8A5A4B',
    fontSize: 12,
    fontWeight: '600'
  },

  vacio: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 29,
    backgroundColor: '#FFFCF8',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#F0E2D7'
  },

  iconoVacio: {
    fontSize: 28,
    color: '#A87963',
    marginBottom: 8
  },

  textoVacio: {
    color: '#55372D',
    fontSize: 15,
    fontWeight: 'bold'
  },

  descripcionVacio: {
    color: '#8D7669',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 7
  },

  pie: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: '#F1E5D9',
    borderTopWidth: 1,
    borderTopColor: '#EAD9CC'
  },

  textoPie: {
    color: '#80695C',
    fontSize: 10,
    letterSpacing: 0.3
  }
});
