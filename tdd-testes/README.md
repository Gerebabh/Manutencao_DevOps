# Aula 05 - Manutenção de Software e DevOps 
Testes Unitários com Node.js e Vitest

> **Tema**: Gerenciador de Tarefas (To-Do List) — apenas em memória  
> **Foco**: testes unitários com TDD  

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Panorama de Testes de Software](#2-panorama-de-testes-de-software)
3. [Introdução ao TDD](#3-introdução-ao-tdd)
4. [Fundamentação Técnica](#4-fundamentação-técnica)
5. [Modelagem da Aplicação](#5-modelagem-da-aplicação)
6. [Arquitetura do Projeto](#6-arquitetura-do-projeto)
7. [Configuração do Repositório Git](#7-configuração-do-repositório-git)
8. [Instalação e Configuração](#8-instalação-e-configuração)
9. [Conceitos Fundamentais de Testes](#9-conceitos-fundamentais-de-testes)
10. [Hands-On: TDD na Prática](#10-hands-on-tdd-na-prática)
11. [Código Completo (Referência)](#11-código-completo-referência)
12. [Testes Completos (Referência)](#12-testes-completos-referência)
13. [Exercícios](#13-exercícios)
14. [Boas Práticas](#14-boas-práticas)
15. [Entrega](#15-entrega)
16. [Referências](#16-referências)

---

## 1. Visão Geral

### Proposta

Construir um **gerenciador de tarefas** (to-do list) simples, sem interface gráfica, sem backend e sem persistência — tudo funciona **apenas em memória**. O objetivo real não é a aplicação em si, mas sim aprender a **escrever testes unitários** usando **TDD** (Test-Driven Development) com **Vitest**.

### Objetivos de Aprendizagem

Ao final desta aula, você será capaz de:

1. Entender a **pirâmide de testes** e o papel dos testes unitários
2. Aplicar o ciclo **Red → Green → Refactor** do TDD
3. Escrever testes unitários com **Vitest** usando `describe`, `it` e `expect`
4. Criar **funções puras** isoladas e testáveis
5. Separar **regras de negócio** da interface gráfica
6. Interpretar os **resultados** dos testes no terminal
7. Usar **Git** para registrar cada fase do TDD com commits convencionados

### Por que usar uma aplicação de tarefas

- Domínio **simples** e universalmente compreendido
- Regras de negócio **claras**: criar, completar, remover, filtrar, contar
- Permite focar nas **funções** sem se perder em complexidade de UI
- Ideal para demonstrar **funções puras** (entrada → saída previsível)

### Por que focar apenas em testes unitários

- São a **base** da pirâmide de testes
- São os **mais rápidos**, **mais baratos** e **mais fáceis** de escrever
- Dão **feedback imediato** sobre erros
- São o ponto de partida ideal para quem está aprendendo testes
- Testes de integração e E2E são temas para aulas futuras

---

## 2. Panorama de Testes de Software

### A Pirâmide de Testes

```
        /\
       /  \        E2E (poucos)
      / E2E\       → simulam o usuário real
     /------\      → lentos e caros
    /Integra-\     Integração (alguns)
   /  ção     \    → testam módulos juntos
  /------------\   → velocidade média
 / Unitários    \  Unitários (MUITOS)
/________________\ → testam unidades isoladas
                   → rápidos e baratos
```

A pirâmide sugere: **escreva muitos testes unitários**, alguns de integração e poucos E2E.

### Comparação entre os tipos de teste

| Aspecto         | Unitário         | Integração        | E2E              |
|-----------------|------------------|-------------------|------------------|
| **Velocidade**  | ⚡ Muito rápido  | 🔄 Médio          | 🐢 Lento         |
| **Custo**       | 💰 Baixo         | 💰💰 Médio        | 💰💰💰 Alto      |
| **Escopo**      | Uma função/módulo| Vários módulos    | Sistema completo |
| **Confiança**   | Foco isolado     | Foco na conexão   | Foco no todo     |
| **Manutenção**  | Fácil            | Média             | Difícil          |
| **Feedback**    | Imediato         | Segundos          | Minutos          |

### Por que testes unitários são a base

- Executam em **milissegundos** — você roda centenas deles em poucos segundos
- São **determinísticos** — mesma entrada, mesma saída, sempre
- São **baratos** para escrever e manter
- Dão **feedback imediato** durante o desenvolvimento
- Quando bem escritos, funcionam como **documentação viva** do código

### Problemas comuns em projetos sem testes (ou com testes mal feitos)

| Problema                      | Consequência                                        |
|-------------------------------|-----------------------------------------------------|
| Foco excessivo em UI/E2E      | Testes lentos, feedback demorado                    |
| Ausência total de testes      | Medo de refatorar, bugs em produção                 |
| Testes frágeis                | Quebram a cada mudança mínima, time perde confiança |
| Testes lentos                 | Devs param de rodá-los, perdem o valor              |
| Testar implementação (não comportamento) | Testes quebram sem o código estar errado  |

### Conclusão

Esta aula foca na **base da pirâmide** porque é onde:
- O retorno sobre investimento (ROI) é maior
- O aprendizado é mais acessível
- O impacto na qualidade do código é mais imediato

---

## 3. Introdução ao TDD

### O que é TDD

**TDD (Test-Driven Development)** — Desenvolvimento Guiado por Testes — é uma prática onde você **escreve o teste ANTES do código**.

Em vez de:
1. Escrever o código → 2. Testar manualmente → 3. (Talvez) escrever um teste

Você faz:
1. **Escrever o teste** (que vai falhar) → 2. **Escrever o código mínimo** para o teste passar → 3. **Refatorar**

### O ciclo Red → Green → Refactor

```
  🔴 RED          🟢 GREEN         🔵 REFACTOR
  ┌──────┐       ┌──────────┐     ┌────────────┐
  │Escreva│       │ Escreva  │     │  Melhore   │
  │ um    │──────▶│ o código │────▶│  o código  │──┐
  │teste  │       │ mínimo   │     │  (sem mudar│  │
  │que    │       │ para     │     │  comporta- │  │
  │FALHA  │       │ PASSAR   │     │  mento)    │  │
  └──────┘       └──────────┘     └────────────┘  │
      ▲                                            │
      └────────────────────────────────────────────┘
                    Repita o ciclo
```

1. **RED** 🔴: Escreva um teste que descreve o comportamento desejado. Rode — ele **falha** (porque o código ainda não existe).
2. **GREEN** 🟢: Escreva o **código mínimo** necessário para o teste passar. Nada mais.
3. **REFACTOR** 🔵: Melhore o código (remova duplicação, renomeie variáveis, simplifique) **sem alterar o comportamento**. Os testes continuam passando.

### Por que TDD ajuda a pensar melhor o código

- Força você a **definir o comportamento antes** de implementar
- O código nasce **testável desde o início**
- Previne **over-engineering** — você só escreve o que o teste exige
- Cria uma **rede de segurança** para refatoração
- Funciona como **documentação** do que o código faz

### Relação entre TDD e funções puras

Uma **função pura** é uma função que:
- Dada a **mesma entrada**, sempre retorna a **mesma saída**
- **Não tem efeitos colaterais** (não modifica variáveis externas, não acessa banco, não muda o DOM)

Funções puras são o **par perfeito** para TDD, porque:
- São **previsíveis** — fáceis de testar
- São **isoladas** — não dependem de nada externo
- São **determinísticas** — rodam em qualquer ordem

### Conexão com a aplicação de tarefas

Cada funcionalidade do gerenciador de tarefas será uma função pura:

```
validateTitle("Estudar")  →  true
createTask("Estudar")     →  { id: 1, title: "Estudar", completed: false }
toggleTask(task)           →  { ...task, completed: true }
```

Para cada uma, **primeiro escrevemos o teste** e **depois o código**.

### Convenção de commits para o TDD

Para **evidenciar** que você seguiu as fases do TDD, cada fase gera um **commit** com prefixo padronizado:

| Fase | Prefixo do commit | O que o commit contém |
|------|-------------------|------------------------|
| 🔴 RED | `red:` | Teste novo que **falha** — código de produção ainda não existe |
| 🟢 GREEN | `green:` | Código **mínimo** para o teste passar |
| 🔵 REFACTOR | `refactor:` | Melhoria no código **sem alterar comportamento** |

Exemplo de histórico:

```
git log --oneline

a1b2c3d refactor: simplifica validateTitle com early return
9d8e7f6 green: implementa validateTitle para strings >= 3 chars
3b2a1f0 red: adiciona testes para validateTitle
```

> **Importante**: O commit `red:` deve alterar **apenas arquivos de teste** (`tests/`). O commit `green:` deve alterar **apenas arquivos de código** (`src/`). Isso comprova que você seguiu a ordem correta.

---

## 4. Fundamentação Técnica

### Node.js (v24 LTS — março 2026)

- Runtime JavaScript server-side, baseado no motor V8
- Suporte nativo a **ES Modules** (`import`/`export`) com `"type": "module"`
- Versão LTS atual: **v24.14.0** — estável e recomendada para projetos
- Não usaremos recursos de servidor (HTTP, filesystem) — apenas a engine JavaScript

### Vitest (v3.x/4.x — 2025/2026)

- Framework de testes **moderno**, **rápido** e **compatível com a API do Jest**
- Alimentado pelo **Vite** — reutiliza transformações, resolvers e plugins
- Principais características:
  - **Watch mode nativo** — re-executa apenas testes afetados ao salvar
  - **ESM nativo** — import/export sem configuração extra
  - **API familiar**: `describe`, `it`, `expect`, `beforeEach`, `vi.fn()`
  - **Coverage nativa** via V8 ou Istanbul
  - **Rápido** — executa em processos paralelos por padrão
- Requer: **Node.js ≥ 20** e **Vite ≥ 6.0**
- Instalação: `npm install -D vitest`

### Boas práticas de testes unitários (síntese)

| Prática                           | Descrição                                                  |
|-----------------------------------|------------------------------------------------------------|
| **Um assert por conceito**        | Cada teste verifica uma coisa                              |
| **Padrão AAA**                    | Arrange → Act → Assert em todo teste                       |
| **Nomes descritivos**             | "deve retornar erro quando título é vazio"                 |
| **Testes independentes**          | Um teste não pode depender do resultado de outro           |
| **Testar comportamento**          | Verificar O QUE a função faz, não COMO ela faz             |
| **Evitar lógica no teste**        | Sem `if`, `for` ou cálculos no teste                       |
| **Setup limpo**                   | Usar `beforeEach` para resetar estado entre testes         |
| **Cobrir cenários felizes e de erro** | Testar tanto o sucesso quanto a falha                  |

---

## 5. Modelagem da Aplicação

### Funcionalidades

A aplicação deve permitir:

| #  | Funcionalidade      | Função                | Entrada                  | Saída                    |
|----|---------------------|-----------------------|--------------------------|--------------------------|
| 1  | Validar título      | `validateTitle(title)`| qualquer valor           | `true` ou `false`        |
| 2  | Criar tarefa        | `createTask(title)`   | string                   | objeto `{ id, title, completed }` |
| 3  | Adicionar tarefa    | `addTask(tasks, title)` | lista + string         | nova lista com a tarefa  |
| 4  | Marcar/Desmarcar    | `toggleTask(task)`    | objeto tarefa            | novo objeto com `completed` invertido |
| 5  | Remover tarefa      | `removeTask(tasks, id)` | lista + id             | nova lista sem a tarefa  |
| 6  | Filtrar tarefas     | `filterTasks(tasks, status)` | lista + filtro    | lista filtrada           |
| 7  | Contar total        | `countTasks(tasks)`   | lista                    | número                   |
| 8  | Contar concluídas   | `countCompleted(tasks)` | lista                  | número                   |
| 9  | Contar pendentes    | `countPending(tasks)` | lista                    | número                   |

### Estrutura de uma tarefa

```javascript
{
  id: 1,              // número incremental
  title: "Estudar",   // string com mínimo 3 caracteres
  completed: false     // booleano
}
```

### Princípios de design

- **Separação**: regras de negócio ficam em `src/`, completamente separadas de qualquer UI
- **Funções puras**: cada função recebe dados e retorna dados novos
- **Imutabilidade**: nenhuma função modifica os dados de entrada — sempre retorna novos objetos/arrays
- **Sem dependências externas**: sem DOM, sem localStorage, sem fetch, sem banco de dados

---

## 6. Arquitetura do Projeto

```
tdd-testes/
├── .gitignore                ← arquivos ignorados pelo Git
├── package.json              ← configuração do projeto Node.js
├── vitest.config.js          ← configuração do Vitest
├── src/
│   └── taskManager.js        ← regras de negócio (funções puras)
└── tests/
    └── taskManager.test.js   ← testes unitários
```

### Papel de cada arquivo

| Arquivo                    | Responsabilidade                                   |
|----------------------------|----------------------------------------------------|
| `.gitignore`               | Impede que `node_modules/` e `coverage/` subam pro Git |
| `package.json`             | Define o projeto, scripts de teste e dependências  |
| `vitest.config.js`         | Configuração mínima do Vitest                      |
| `src/taskManager.js`       | Todas as funções de negócio — **o que testamos**   |
| `tests/taskManager.test.js`| Todos os testes unitários — **como testamos**      |

### Por que essa estrutura

- `src/` e `tests/` separados: fica claro o que é código de produção e o que é código de teste
- Um arquivo de negócio + um arquivo de teste: simples e direto para uma aula
- Sem pastas aninhadas desnecessárias: o foco é o conteúdo, não a arquitetura

---

## 7. Configuração do Repositório Git

Antes de escrever qualquer código, vamos configurar o **repositório Git** — ele será sua ferramenta de entrega e de evidência do TDD.

### 1. Criar o repositório remoto

Crie um repositório no **GitHub** (ou GitLab/Bitbucket):
- Nome sugerido: `tdd-testes`
- Marque **"Add a README file"** para já inicializar com um commit
- Visibilidade: **público** (para facilitar a avaliação)

### 2. Clonar o repositório

```bash
git clone https://github.com/SEU-USUARIO/tdd-testes.git
cd tdd-testes
```

### 3. Criar o `.gitignore`

Crie o arquivo `.gitignore` na raiz do projeto:

```
node_modules/
coverage/
```

**Por que isso é importante?**

O diretório `node_modules/` contém todas as dependências instaladas pelo `npm install`. Ele é **gerado automaticamente** e pode conter **milhares de arquivos** (centenas de megabytes). Não faz sentido enviar isso para o repositório remoto porque:

- Qualquer pessoa pode regenerar rodando `npm install`
- Poluiria o histórico de commits com arquivos que não são seus
- Tornaria o repositório desnecessariamente pesado

O `coverage/` é o diretório gerado pelo relatório de cobertura de testes — também é temporário e regenerável.

> O `.gitignore` diz ao Git: **"ignore esses arquivos/pastas — não rastreie nem envie para o remoto."**

### 4. Primeiro commit

```bash
git add .gitignore
git commit -m "chore: adiciona .gitignore para Node.js"
git push
```

---

## 8. Instalação e Configuração

> Estes passos assumem que você já clonou o repositório (seção 7).

### 1. Inicializar o projeto Node.js

```bash
npm init -y
```

### 2. Configurar ESM no package.json

Adicione `"type": "module"` ao `package.json` para usar `import`/`export`:

```json
{
  "name": "tdd-testes",
  "version": "1.0.0",
  "description": "Aula prática de testes unitários com Vitest e TDD",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```

### 3. Instalar o Vitest

```bash
npm install -D vitest
```

### 4. Criar a configuração do Vitest

Crie o arquivo `vitest.config.js` na raiz do projeto:

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    environment: 'node',
  },
});
```

> **Nota**: `globals: false` significa que você precisa importar `describe`, `it`, `expect` explicitamente nos testes. Isso é mais explícito e didático.

### 5. Criar a estrutura de pastas

```bash
mkdir src tests
```

### 6. Scripts disponíveis

| Comando             | O que faz                                              |
|---------------------|--------------------------------------------------------|
| `npm test`          | Roda todos os testes uma vez                           |
| `npm run test:watch`| Roda em modo watch — re-executa ao salvar              |
| `npm run coverage`  | Roda os testes e gera relatório de cobertura de código |

### 7. Como rodar

```bash
# Rodar testes uma vez
npm test

# Rodar em modo watch (desenvolvimento)
npm run test:watch

# Ver cobertura de código
npm run coverage
```

### 8. Vitest UI (modo visual)

O Vitest oferece uma **interface gráfica** no navegador para visualizar seus testes de forma interativa. Para usar:

```bash
# Instalar o pacote da UI (só na primeira vez)
npm install -D @vitest/ui

# Rodar com interface visual
npx vitest --ui
```

A UI abre no navegador e mostra:
- Lista de todos os testes organizados por `describe`
- Status de cada teste (passou/falhou) com cores
- Tempo de execução de cada teste
- Detalhes dos erros quando um teste falha
- Re-execução automática ao salvar

> **Dica**: A UI é ótima para **visualizar** os testes durante o desenvolvimento. Para a entrega e CI, use `npm test` (modo CLI).

### 9. Commit do setup

```bash
git add .
git commit -m "chore: configura projeto Node.js com Vitest"
git push
```

### Saída esperada (ao final de toda a implementação)

```
 ✓ tests/taskManager.test.js (46)
   ✓ validateTitle (11)
   ✓ createTask (4)
   ✓ addTask (8)
   ✓ toggleTask (4)
   ✓ removeTask (5)
   ✓ filterTasks (6)
   ✓ countTasks (2)
   ✓ countCompleted (3)
   ✓ countPending (3)

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  ...
   Duration  ...
```

---

## 9. Conceitos Fundamentais de Testes

### O que é um teste unitário

Um teste unitário verifica o comportamento de uma **unidade isolada** de código — geralmente uma **função** ou **método**. Ele roda de forma independente, sem precisar de banco de dados, rede, DOM ou outros módulos.

### O que é uma "unidade"

No contexto desta aula, cada **função exportada** em `taskManager.js` é uma unidade:

```javascript
// Cada uma dessas é uma unidade testável:
validateTitle(title)
createTask(title)
addTask(tasks, title)
toggleTask(task)
removeTask(tasks, taskId)
filterTasks(tasks, status)
countTasks(tasks)
countCompleted(tasks)
countPending(tasks)
```

### Função pura

Uma função pura segue duas regras:

1. **Determinística**: mesma entrada → mesma saída, sempre
2. **Sem efeitos colaterais**: não modifica nada fora do seu escopo

```javascript
// ✅ PURA — mesma entrada, mesma saída, sem efeitos colaterais
function toggleTask(task) {
  return { ...task, completed: !task.completed };
}

// ❌ IMPURA — modifica o objeto original (efeito colateral)
function toggleTask(task) {
  task.completed = !task.completed; // MUTAÇÃO!
  return task;
}
```

### Glossário JavaScript para esta aula

Alguns conceitos de JavaScript usados nesta aula que podem ser novos para você:

#### Spread operator (`...`)

O operador spread (`...`) serve para **"espalhar"** os elementos de um objeto ou array. Ele é usado para criar **cópias** sem modificar o original.

**Com objetos** — cria um novo objeto copiando as propriedades:

```javascript
const task = { id: 1, title: 'Estudar', completed: false };

// Cria um NOVO objeto com todas as propriedades de task,
// mas com completed invertido:
const toggled = { ...task, completed: !task.completed };

// toggled = { id: 1, title: 'Estudar', completed: true }  ← NOVO objeto
// task    = { id: 1, title: 'Estudar', completed: false }  ← original intacto
```

**Com arrays** — cria um novo array copiando os elementos:

```javascript
const tasks = [tarefa1, tarefa2];
const newTask = { id: 3, title: 'Nova', completed: false };

// Cria um NOVO array com todos os elementos de tasks + newTask:
const updated = [...tasks, newTask];

// updated = [tarefa1, tarefa2, newTask]  ← NOVO array
// tasks   = [tarefa1, tarefa2]           ← original intacto
```

**Sem spread — MUTAÇÃO (não queremos isso):**

```javascript
// ❌ push MODIFICA o array original:
tasks.push(newTask);
// tasks = [tarefa1, tarefa2, newTask]  ← original MODIFICADO! 💥

// ❌ atribuição direta MODIFICA o objeto original:
task.completed = true;
// task = { id: 1, title: 'Estudar', completed: true }  ← original MODIFICADO! 💥
```

#### Efeito colateral (side effect)

Um **efeito colateral** acontece quando uma função **modifica algo fora dela** — por exemplo, modifica o objeto que recebeu como parâmetro, altera uma variável global, ou escreve no banco de dados.

```javascript
// ❌ COM efeito colateral — modifica o objeto original
function toggleTask(task) {
  task.completed = !task.completed; // modifica o objeto que foi passado!
  return task;                       // retorna o MESMO objeto
}

const task = { id: 1, title: 'Estudar', completed: false };
const result = toggleTask(task);
// task.completed   === true   ← o original FOI modificado! 😱
// result === task             ← são o MESMO objeto na memória
```

```javascript
// ✅ SEM efeito colateral — cria um objeto novo
function toggleTask(task) {
  return { ...task, completed: !task.completed }; // retorna um NOVO objeto
}

const task = { id: 1, title: 'Estudar', completed: false };
const result = toggleTask(task);
// task.completed   === false  ← o original está intacto ✅
// result.completed === true   ← o novo objeto tem o valor atualizado
// result !== task             ← são objetos DIFERENTES na memória
```

> **Por que evitar efeitos colaterais?** Quando funções não modificam seus parâmetros, o código fica mais previsível, mais fácil de testar e menos propenso a bugs. Você sempre sabe que o dado original continua o mesmo.

#### Arrow function (`=>`)

Função anônima com sintaxe curta. Muito usada em callbacks:

```javascript
// Função tradicional
tasks.filter(function(task) { return task.completed === true; });

// Arrow function (faz a mesma coisa, mais curto)
tasks.filter((task) => task.completed === true);
```

### Referência de funções do Vitest

Estas são as funções do Vitest que usamos nesta aula. Você precisa importá-las no início do arquivo de teste:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
```

| Função | O que faz | Exemplo |
|--------|-----------|---------|
| `describe(nome, fn)` | Agrupa testes relacionados numa **suíte** | `describe('validateTitle', () => { ... })` |
| `it(nome, fn)` | Define um **caso de teste** individual | `it('deve retornar true para título válido', () => { ... })` |
| `test(nome, fn)` | Sinônimo de `it` — faz exatamente a mesma coisa | `test('deve retornar true', () => { ... })` |
| `expect(valor)` | Cria uma **asserção** — verifica se o valor corresponde ao esperado | `expect(result).toBe(true)` |
| `beforeEach(fn)` | Roda uma função **antes de cada `it()`** dentro do `describe` | `beforeEach(() => { resetId(); })` |

### Principais matchers do `expect`

| Matcher | O que verifica | Exemplo |
|---------|---------------|---------|
| `.toBe(valor)` | Igualdade estrita (`===`) — ideal para primitivos | `expect(result).toBe(true)` |
| `.toHaveProperty(prop, valor)` | Se o objeto tem a propriedade (com valor opcional) | `expect(task).toHaveProperty('title', 'Estudar')` |
| `.toHaveLength(n)` | Comprimento de array ou string | `expect(tasks).toHaveLength(3)` |
| `.toThrow(mensagem)` | Se a função lança um erro com a mensagem | `expect(() => fn()).toThrow('Erro')` |
| `.not.toBe(valor)` | Negação — que NÃO seja igual | `expect(updated).not.toBe(original)` |
| `.toBeUndefined()` | Se o valor é `undefined` | `expect(result).toBeUndefined()` |

### Arrange, Act, Assert (AAA)

Todo teste segue três etapas:

```javascript
it('deve marcar uma tarefa pendente como concluída', () => {
  // ARRANGE — preparar os dados
  const task = createTask('Estudar');

  // ACT — executar a ação
  const result = toggleTask(task);

  // ASSERT — verificar o resultado
  expect(result.completed).toBe(true);
});
```

| Etapa       | O que faz                      | Exemplo                        |
|-------------|--------------------------------|--------------------------------|
| **Arrange** | Prepara os dados de entrada    | `const task = createTask(...)` |
| **Act**     | Executa a função sendo testada | `const result = toggleTask(task)` |
| **Assert**  | Verifica o resultado           | `expect(result.completed).toBe(true)` |

### Suíte de testes

Uma **suíte** é um agrupamento lógico de testes relacionados, criado com `describe`:

```javascript
describe('validateTitle', () => {
  it('deve retornar true para título válido', () => { /* ... */ });
  it('deve retornar false para string vazia', () => { /* ... */ });
  it('deve retornar false para null', () => { /* ... */ });
});
```

### Caso de teste

Cada `it()` (ou `test()`) é um **caso de teste** — verifica um cenário específico.

### Cenário feliz vs cenário de erro

| Tipo              | Descrição                             | Exemplo                        |
|-------------------|---------------------------------------|--------------------------------|
| **Cenário feliz** | O caminho esperado funciona           | Criar tarefa com título válido |
| **Cenário de erro** | Entradas inválidas são tratadas     | Criar tarefa com título vazio  |
| **Edge case**     | Situações limítrofes ou incomuns      | Lista vazia, ID inexistente    |

Bons testes cobrem **todos os três tipos**.

---

## 10. Hands-On: TDD na Prática

Nesta seção, vamos implementar **3 funções** juntos, passo a passo, seguindo o ciclo TDD completo. Todo o código que você precisa escrever está **aqui** — siga na ordem.

Para cada função, o ciclo é sempre:

1. 🔴 **RED** — Escreva os testes → `npm test` → veja FALHAR → commit `red:`
2. 🟢 **GREEN** — Escreva o código mínimo → `npm test` → veja PASSAR → commit `green:`
3. 🔵 **REFACTOR** — Melhore (se precisar) → `npm test` → confirme que continua passando → commit `refactor:`

---

### Etapa 1: validateTitle

Nossa primeira função: recebe qualquer valor e diz se é um título válido (string com no mínimo 3 caracteres após trim).

#### 🔴 RED — Escrevendo os testes

Crie o arquivo `tests/taskManager.test.js` com o seguinte conteúdo:

```javascript
import { describe, it, expect } from 'vitest';
import { validateTitle } from '../src/taskManager.js';

// ============================================================
// 1. validateTitle
// ============================================================
describe('validateTitle', () => {
  it('deve retornar true para um título válido', () => {
    expect(validateTitle('Estudar Vitest')).toBe(true);
  });

  it('deve retornar true para título com exatamente 3 caracteres', () => {
    expect(validateTitle('abc')).toBe(true);
  });

  it('deve retornar false para string vazia', () => {
    expect(validateTitle('')).toBe(false);
  });

  it('deve retornar false para string com apenas espaços', () => {
    expect(validateTitle('   ')).toBe(false);
  });

  it('deve retornar false para título com menos de 3 caracteres', () => {
    expect(validateTitle('ab')).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validateTitle(null)).toBe(false);
  });

  it('deve retornar false para undefined', () => {
    expect(validateTitle(undefined)).toBe(false);
  });

  it('deve retornar false para número', () => {
    expect(validateTitle(123)).toBe(false);
  });

  it('deve retornar false para booleano', () => {
    expect(validateTitle(true)).toBe(false);
  });

  it('deve retornar false para array', () => {
    expect(validateTitle(['tarefa'])).toBe(false);
  });

  it('deve considerar o título após trim', () => {
    expect(validateTitle('  abc  ')).toBe(true);
  });
});
```

> **O que está acontecendo?**
> - `import { describe, it, expect } from 'vitest'` — importa as funções de teste do Vitest
> - `import { validateTitle } from '../src/taskManager.js'` — importa a função que **ainda não existe**
> - `describe('validateTitle', () => { ... })` — cria uma suíte de testes agrupando todos os testes de `validateTitle`
> - Cada `it('deve ...', () => { ... })` é um caso de teste individual
> - `expect(valor).toBe(esperado)` — verifica se o valor é exatamente o esperado

Rode os testes:

```bash
npm test
```

**Saída esperada — FALHA (🔴):**

```
 FAIL  tests/taskManager.test.js
Error: Failed to load url ../src/taskManager.js
```

> Isso é **esperado**! O arquivo `src/taskManager.js` ainda não existe. O teste está pedindo algo que não foi criado. Esse é o **RED** — o teste falha porque o código de produção não existe.

Faça o commit da fase RED — **apenas os testes**:

```bash
git add tests/
git commit -m "red: adiciona testes para validateTitle"
```

#### 🟢 GREEN — Implementando o código mínimo

Agora crie o arquivo `src/taskManager.js` com a implementação:

```javascript
// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

export function validateTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length >= 3;
}
```

Rode os testes novamente:

```bash
npm test
```

**Saída esperada — SUCESSO (🟢):**

```
 ✓ tests/taskManager.test.js (11)
   ✓ validateTitle (11)

 Test Files  1 passed (1)
      Tests  11 passed (11)
```

> **Verde!** Todos os 11 testes passaram. A implementação atende a todos os cenários que testamos.

Faça o commit da fase GREEN — **apenas o código**:

```bash
git add src/
git commit -m "green: implementa validateTitle"
```

#### 🔵 REFACTOR

Neste caso, a implementação já está limpa e simples. Se houvesse algo a melhorar (renomear variáveis, simplificar condições), você faria a mudança, rodaria `npm test` para confirmar que continua verde, e commitaria:

```bash
# (só se tiver mudanças de melhoria)
npm test  # → confirma que continua passando
git add .
git commit -m "refactor: simplifica validateTitle"
```

Push:

```bash
git push
```

> ✅ **Primeiro ciclo TDD completo!** Teste → Falha → Código → Passa → Commit.

---

### Etapa 2: createTask

Próxima função: recebe um título e retorna um objeto tarefa com `id`, `title` e `completed`.

Para gerar IDs incrementais, precisaremos de uma variável de módulo (`_nextId`) e uma função auxiliar `resetId()`. O `resetId()` serve para os testes: ele garante que cada teste começa com o ID 1, independente da ordem de execução.

#### 🔴 RED — Escrevendo os testes

Abra `tests/taskManager.test.js` e faça duas alterações:

**1. Atualize as importações** no topo do arquivo:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTitle,
  createTask,
  resetId,
} from '../src/taskManager.js';
```

> Adicionamos `beforeEach` das funções do Vitest, e `createTask` + `resetId` do nosso módulo.

**2. Adicione o bloco de testes** ao final do arquivo (após o `describe` de `validateTitle`):

```javascript
// ============================================================
// 2. createTask
// ============================================================
describe('createTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar uma tarefa com as propriedades corretas', () => {
    const task = createTask('Estudar TDD');

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title', 'Estudar TDD');
    expect(task).toHaveProperty('completed', false);
  });

  it('deve atribuir IDs incrementais', () => {
    const task1 = createTask('Tarefa 1');
    const task2 = createTask('Tarefa 2');

    expect(task2.id).toBe(task1.id + 1);
  });

  it('deve iniciar com completed = false', () => {
    const task = createTask('Nova tarefa');

    expect(task.completed).toBe(false);
  });

  it('deve fazer trim do título', () => {
    const task = createTask('  Título com espaços  ');

    expect(task.title).toBe('Título com espaços');
  });
});
```

> **`beforeEach(() => { resetId(); })`** — roda **antes de cada `it()`** dentro deste `describe`. Aqui reseta o contador de IDs para 1, garantindo que cada teste começa do zero. Sem isso, o ID dependeria de quantos testes rodaram antes, e os testes ficariam imprevisíveis.

> **`toHaveProperty('title', 'Estudar TDD')`** — verifica que o objeto retornado tem a propriedade `title` com o valor `'Estudar TDD'`.

Rode:

```bash
npm test
```

**Saída esperada — FALHA (🔴):**

```
 FAIL  tests/taskManager.test.js
 ✓ validateTitle (11)
 ✗ createTask (4)
   TypeError: createTask is not a function
```

> O teste de `validateTitle` continua passando (11 ✓), mas `createTask` falha porque a função não existe em `src/taskManager.js` ainda.

Commit:

```bash
git add tests/
git commit -m "red: adiciona testes para createTask"
```

#### 🟢 GREEN — Implementando o código

Abra `src/taskManager.js` e adicione **antes** da função `validateTitle`:

```javascript
let _nextId = 1;

/**
 * Reseta o contador de IDs (útil para testes determinísticos).
 */
export function resetId() {
  _nextId = 1;
}
```

E adicione **após** a função `validateTitle`:

```javascript
// ------------------------------------------------------------
// Criação
// ------------------------------------------------------------

export function createTask(title) {
  return {
    id: _nextId++,
    title: title.trim(),
    completed: false,
  };
}
```

> **`_nextId++`** — usa o valor atual de `_nextId` e depois incrementa em 1. A primeira tarefa recebe ID 1, a segunda recebe 2, e assim por diante.

Rode:

```bash
npm test
```

**Saída esperada — SUCESSO (🟢):**

```
 ✓ tests/taskManager.test.js (15)
   ✓ validateTitle (11)
   ✓ createTask (4)

 Test Files  1 passed (1)
      Tests  15 passed (15)
```

Commit e push:

```bash
git add src/
git commit -m "green: implementa createTask e resetId"
git push
```

---

### Etapa 3: addTask

A mais complexa das três: recebe uma lista de tarefas e um título, **valida** o título, **cria** a tarefa e retorna uma **nova lista** com a tarefa adicionada. Se o título for inválido, **lança um erro**.

Esta função **compõe** as duas anteriores (`validateTitle` + `createTask`), e demonstra dois conceitos importantes:
- **Imutabilidade**: usa o spread operator `[...tasks, newTask]` para criar um novo array sem modificar o original
- **Tratamento de erro**: usa `throw new Error(...)` para rejeitar títulos inválidos

#### 🔴 RED — Escrevendo os testes

**1. Atualize o import** no topo do arquivo de teste:

```javascript
import {
  validateTitle,
  createTask,
  addTask,
  resetId,
} from '../src/taskManager.js';
```

**2. Adicione os testes** ao final do arquivo:

```javascript
// ============================================================
// 3. addTask
// ============================================================
describe('addTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve adicionar uma tarefa a uma lista vazia', () => {
    const tasks = addTask([], 'Primeira tarefa');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Primeira tarefa');
  });

  it('deve adicionar uma tarefa a uma lista existente', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');

    expect(tasks).toHaveLength(2);
    expect(tasks[1].title).toBe('Tarefa 2');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
  });

  it('deve lançar erro para título vazio', () => {
    expect(() => addTask([], '')).toThrow('Título inválido');
  });

  it('deve lançar erro para título null', () => {
    expect(() => addTask([], null)).toThrow('Título inválido');
  });

  it('deve lançar erro para título undefined', () => {
    expect(() => addTask([], undefined)).toThrow('Título inválido');
  });

  it('deve lançar erro para título com menos de 3 caracteres', () => {
    expect(() => addTask([], 'ab')).toThrow('Título inválido');
  });

  it('deve lançar erro para título numérico', () => {
    expect(() => addTask([], 42)).toThrow('Título inválido');
  });
});
```

> **Testando erros**: para verificar que uma função **lança um erro**, envolvemos a chamada numa arrow function: `expect(() => addTask([], '')).toThrow('Título inválido')`. Isso permite que o Vitest **capture** o erro em vez de ele explodir o teste.

> **Imutabilidade**: o teste `expect(updated).not.toBe(original)` verifica que `addTask` retorna um array **novo**, e não o mesmo array modificado. O `.toBe()` compara **referência** na memória (se é o mesmo objeto), não apenas o conteúdo. Depois confirmamos que o array original continua vazio com `expect(original).toHaveLength(0)`.

Rode e veja falhar:

```bash
npm test
```

**Saída esperada — FALHA (🔴):**

```
 FAIL  tests/taskManager.test.js
 ✓ validateTitle (11)
 ✓ createTask (4)
 ✗ addTask (8)
   TypeError: addTask is not a function
```

Commit:

```bash
git add tests/
git commit -m "red: adiciona testes para addTask"
```

#### 🟢 GREEN — Implementando o código

Adicione ao `src/taskManager.js`, após a função `createTask`:

```javascript
// ------------------------------------------------------------
// Adição com validação
// ------------------------------------------------------------

export function addTask(tasks, title) {
  if (!validateTitle(title)) {
    throw new Error(
      'Título inválido: deve ser uma string com pelo menos 3 caracteres.'
    );
  }

  const newTask = createTask(title);
  return [...tasks, newTask];
}
```

> **`[...tasks, newTask]`** — o operador spread (`...`) "espalha" todos os elementos do array `tasks` e adiciona `newTask` ao final, criando um **novo array**. O array original **não é modificado**. Isso é imutabilidade. (Relembre a explicação do spread na seção 9.)

> **`throw new Error(...)`** — quando o título é inválido, a função **lança um erro** em vez de retornar um valor. Quem chamou a função precisa tratar esse erro (ou o programa para). Nos testes, usamos `.toThrow()` para verificar que o erro foi lançado.

Rode:

```bash
npm test
```

**Saída esperada — SUCESSO (🟢):**

```
 ✓ tests/taskManager.test.js (23)
   ✓ validateTitle (11)
   ✓ createTask (4)
   ✓ addTask (8)

 Test Files  1 passed (1)
      Tests  23 passed (23)
```

Commit e push:

```bash
git add src/
git commit -m "green: implementa addTask"
git push
```

---

### Recapitulação do Hands-On

Parabéns! 🎉 Você implementou 3 funções seguindo o ciclo TDD completo:

| Função | Testes | O que praticou |
|--------|--------|---------------|
| `validateTitle` | 11 | TDD básico, cenários felizes e de erro, tipos variados |
| `createTask` | 4 | Objetos, `beforeEach`, `toHaveProperty` |
| `addTask` | 8 | Composição, imutabilidade (spread), `toThrow`, tratamento de erro |
| **Total** | **23** | |

Seu `git log --oneline` deve estar parecido com:

```
f4a3b2c green: implementa addTask
a1b2c3d red: adiciona testes para addTask
9d8e7f6 green: implementa createTask e resetId
3b2a1f0 red: adiciona testes para createTask
c1d2e3f green: implementa validateTitle
b0a1b2c red: adiciona testes para validateTitle
7a8b9c0 chore: configura projeto Node.js com Vitest
1a2b3c4 chore: adiciona .gitignore
```

> Cada `red:` vem antes do `green:` correspondente. Cada `red:` altera apenas `tests/`, cada `green:` altera apenas `src/`. Essa é a **evidência** de que você seguiu TDD.

---

## 11. Código Completo (Referência)

> Este é o código final com **todas as 9 funções** implementadas. Use como referência ao fazer os exercícios. **Não copie tudo de uma vez** — implemente cada função seguindo o ciclo TDD.

Arquivo: `src/taskManager.js`

```javascript
// ============================================================
// taskManager.js — Regras de negócio do gerenciador de tarefas
// ============================================================
// Todas as funções são PURAS:
//   - mesma entrada → mesma saída
//   - sem efeitos colaterais
//   - sem dependência de DOM, banco de dados ou APIs externas
// ============================================================

let _nextId = 1;

/**
 * Reseta o contador de IDs (útil para testes determinísticos).
 */
export function resetId() {
  _nextId = 1;
}

// ------------------------------------------------------------
// Validação
// ------------------------------------------------------------

export function validateTitle(title) {
  if (typeof title !== 'string') {
    return false;
  }

  const trimmed = title.trim();
  return trimmed.length >= 3;
}

// ------------------------------------------------------------
// Criação
// ------------------------------------------------------------

export function createTask(title) {
  return {
    id: _nextId++,
    title: title.trim(),
    completed: false,
  };
}

export function addTask(tasks, title) {
  if (!validateTitle(title)) {
    throw new Error(
      'Título inválido: deve ser uma string com pelo menos 3 caracteres.'
    );
  }

  const newTask = createTask(title);
  return [...tasks, newTask];
}

// ------------------------------------------------------------
// Alteração de estado
// ------------------------------------------------------------

export function toggleTask(task) {
  return {
    ...task,
    completed: !task.completed,
  };
}

// ------------------------------------------------------------
// Remoção
// ------------------------------------------------------------

export function removeTask(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

// ------------------------------------------------------------
// Filtros
// ------------------------------------------------------------

export function filterTasks(tasks, status) {
  switch (status) {
    case 'completed':
      return tasks.filter((task) => task.completed === true);
    case 'pending':
      return tasks.filter((task) => task.completed === false);
    case 'all':
    default:
      return [...tasks];
  }
}

// ------------------------------------------------------------
// Contagens
// ------------------------------------------------------------

export function countTasks(tasks) {
  return tasks.length;
}

export function countCompleted(tasks) {
  return tasks.filter((task) => task.completed === true).length;
}

export function countPending(tasks) {
  return tasks.filter((task) => task.completed === false).length;
}
```

### Notas sobre o código

- **`resetId()`**: Existe apenas para permitir testes determinísticos. Em uma aplicação real, IDs poderiam ser UUIDs.
- **`_nextId`**: Variável de módulo (não global). Único estado mutável — necessário para IDs incrementais.
- **Todas as outras funções são puras**: recebem dados, retornam dados novos, sem modificar a entrada.
- **Spread operator (`...`)**: Usado em `toggleTask`, `addTask` e `filterTasks` para garantir imutabilidade.

---

## 12. Testes Completos (Referência)

> Estes são todos os 46 testes do projeto. Use como referência ao fazer os exercícios. **Implemente cada bloco seguindo o ciclo RED → GREEN**, não copie tudo de uma vez.

Arquivo: `tests/taskManager.test.js`

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateTitle,
  createTask,
  addTask,
  toggleTask,
  removeTask,
  filterTasks,
  countTasks,
  countCompleted,
  countPending,
  resetId,
} from '../src/taskManager.js';

// ============================================================
// 1. validateTitle
// ============================================================
describe('validateTitle', () => {
  it('deve retornar true para um título válido', () => {
    expect(validateTitle('Estudar Vitest')).toBe(true);
  });

  it('deve retornar true para título com exatamente 3 caracteres', () => {
    expect(validateTitle('abc')).toBe(true);
  });

  it('deve retornar false para string vazia', () => {
    expect(validateTitle('')).toBe(false);
  });

  it('deve retornar false para string com apenas espaços', () => {
    expect(validateTitle('   ')).toBe(false);
  });

  it('deve retornar false para título com menos de 3 caracteres', () => {
    expect(validateTitle('ab')).toBe(false);
  });

  it('deve retornar false para null', () => {
    expect(validateTitle(null)).toBe(false);
  });

  it('deve retornar false para undefined', () => {
    expect(validateTitle(undefined)).toBe(false);
  });

  it('deve retornar false para número', () => {
    expect(validateTitle(123)).toBe(false);
  });

  it('deve retornar false para booleano', () => {
    expect(validateTitle(true)).toBe(false);
  });

  it('deve retornar false para array', () => {
    expect(validateTitle(['tarefa'])).toBe(false);
  });

  it('deve considerar o título após trim', () => {
    expect(validateTitle('  abc  ')).toBe(true);
  });
});

// ============================================================
// 2. createTask
// ============================================================
describe('createTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve criar uma tarefa com as propriedades corretas', () => {
    const task = createTask('Estudar TDD');

    expect(task).toHaveProperty('id');
    expect(task).toHaveProperty('title', 'Estudar TDD');
    expect(task).toHaveProperty('completed', false);
  });

  it('deve atribuir IDs incrementais', () => {
    const task1 = createTask('Tarefa 1');
    const task2 = createTask('Tarefa 2');

    expect(task2.id).toBe(task1.id + 1);
  });

  it('deve iniciar com completed = false', () => {
    const task = createTask('Nova tarefa');

    expect(task.completed).toBe(false);
  });

  it('deve fazer trim do título', () => {
    const task = createTask('  Título com espaços  ');

    expect(task.title).toBe('Título com espaços');
  });
});

// ============================================================
// 3. addTask
// ============================================================
describe('addTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve adicionar uma tarefa a uma lista vazia', () => {
    const tasks = addTask([], 'Primeira tarefa');

    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Primeira tarefa');
  });

  it('deve adicionar uma tarefa a uma lista existente', () => {
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');

    expect(tasks).toHaveLength(2);
    expect(tasks[1].title).toBe('Tarefa 2');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const original = [];
    const updated = addTask(original, 'Nova tarefa');

    expect(updated).not.toBe(original);
    expect(original).toHaveLength(0);
  });

  it('deve lançar erro para título vazio', () => {
    expect(() => addTask([], '')).toThrow('Título inválido');
  });

  it('deve lançar erro para título null', () => {
    expect(() => addTask([], null)).toThrow('Título inválido');
  });

  it('deve lançar erro para título undefined', () => {
    expect(() => addTask([], undefined)).toThrow('Título inválido');
  });

  it('deve lançar erro para título com menos de 3 caracteres', () => {
    expect(() => addTask([], 'ab')).toThrow('Título inválido');
  });

  it('deve lançar erro para título numérico', () => {
    expect(() => addTask([], 42)).toThrow('Título inválido');
  });
});

// ============================================================
// 4. toggleTask
// ============================================================
describe('toggleTask', () => {
  beforeEach(() => {
    resetId();
  });

  it('deve marcar uma tarefa pendente como concluída', () => {
    const task = createTask('Tarefa pendente');
    const toggled = toggleTask(task);

    expect(toggled.completed).toBe(true);
  });

  it('deve desmarcar uma tarefa concluída', () => {
    const task = createTask('Tarefa pendente');
    const completed = toggleTask(task);
    const uncompleted = toggleTask(completed);

    expect(uncompleted.completed).toBe(false);
  });

  it('deve manter o id e o título inalterados', () => {
    const task = createTask('Minha tarefa');
    const toggled = toggleTask(task);

    expect(toggled.id).toBe(task.id);
    expect(toggled.title).toBe(task.title);
  });

  it('deve retornar um NOVO objeto (imutabilidade)', () => {
    const task = createTask('Tarefa original');
    const toggled = toggleTask(task);

    expect(toggled).not.toBe(task);
    expect(task.completed).toBe(false); // original inalterado
  });
});

// ============================================================
// 5. removeTask
// ============================================================
describe('removeTask', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
  });

  it('deve remover uma tarefa pelo ID', () => {
    const updated = removeTask(tasks, 2);

    expect(updated).toHaveLength(2);
    expect(updated.find((t) => t.id === 2)).toBeUndefined();
  });

  it('deve manter as outras tarefas intactas', () => {
    const updated = removeTask(tasks, 2);

    expect(updated[0].title).toBe('Tarefa 1');
    expect(updated[1].title).toBe('Tarefa 3');
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const updated = removeTask(tasks, 1);

    expect(updated).not.toBe(tasks);
    expect(tasks).toHaveLength(3); // original inalterado
  });

  it('deve retornar a lista completa se o ID não existir', () => {
    const updated = removeTask(tasks, 999);

    expect(updated).toHaveLength(3);
  });

  it('deve retornar array vazio ao remover de lista vazia', () => {
    const updated = removeTask([], 1);

    expect(updated).toHaveLength(0);
  });
});

// ============================================================
// 6. filterTasks
// ============================================================
describe('filterTasks', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    // Marca a segunda tarefa como concluída
    tasks = tasks.map((t) => (t.id === 2 ? toggleTask(t) : t));
  });

  it('deve retornar todas as tarefas com filtro "all"', () => {
    const result = filterTasks(tasks, 'all');

    expect(result).toHaveLength(3);
  });

  it('deve retornar apenas pendentes com filtro "pending"', () => {
    const result = filterTasks(tasks, 'pending');

    expect(result).toHaveLength(2);
    result.forEach((t) => expect(t.completed).toBe(false));
  });

  it('deve retornar apenas concluídas com filtro "completed"', () => {
    const result = filterTasks(tasks, 'completed');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Tarefa 2');
    expect(result[0].completed).toBe(true);
  });

  it('deve retornar todas as tarefas para filtro desconhecido (default)', () => {
    const result = filterTasks(tasks, 'invalido');

    expect(result).toHaveLength(3);
  });

  it('deve retornar array vazio para lista vazia', () => {
    expect(filterTasks([], 'all')).toHaveLength(0);
    expect(filterTasks([], 'pending')).toHaveLength(0);
    expect(filterTasks([], 'completed')).toHaveLength(0);
  });

  it('deve retornar um NOVO array (imutabilidade)', () => {
    const result = filterTasks(tasks, 'all');

    expect(result).not.toBe(tasks);
  });
});

// ============================================================
// 7. Contagens
// ============================================================
describe('countTasks', () => {
  it('deve retornar 0 para lista vazia', () => {
    expect(countTasks([])).toBe(0);
  });

  it('deve retornar o total de tarefas', () => {
    resetId();
    let tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');

    expect(countTasks(tasks)).toBe(3);
  });
});

describe('countCompleted', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    tasks = tasks.map((t) => (t.id <= 2 ? toggleTask(t) : t));
  });

  it('deve retornar 0 para lista vazia', () => {
    expect(countCompleted([])).toBe(0);
  });

  it('deve contar corretamente as tarefas concluídas', () => {
    expect(countCompleted(tasks)).toBe(2);
  });

  it('deve retornar 0 quando nenhuma tarefa está concluída', () => {
    resetId();
    let noCompleted = addTask([], 'Tarefa A');
    noCompleted = addTask(noCompleted, 'Tarefa B');

    expect(countCompleted(noCompleted)).toBe(0);
  });
});

describe('countPending', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
    tasks = addTask(tasks, 'Tarefa 3');
    tasks = tasks.map((t) => (t.id === 1 ? toggleTask(t) : t));
  });

  it('deve retornar 0 para lista vazia', () => {
    expect(countPending([])).toBe(0);
  });

  it('deve contar corretamente as tarefas pendentes', () => {
    expect(countPending(tasks)).toBe(2);
  });

  it('deve retornar 0 quando todas as tarefas estão concluídas', () => {
    const allCompleted = tasks.map((t) => ({ ...t, completed: true }));

    expect(countPending(allCompleted)).toBe(0);
  });
});
```

### Resumo dos testes

| Suíte            | Testes | O que verifica                                |
|------------------|--------|-----------------------------------------------|
| `validateTitle`  | 11     | Validação de título: tipos, tamanho, trim     |
| `createTask`     | 4      | Criação: propriedades, IDs, trim              |
| `addTask`        | 8      | Adição: válida, inválida, imutabilidade       |
| `toggleTask`     | 4      | Alternar: marcar, desmarcar, imutabilidade    |
| `removeTask`     | 5      | Remoção: por ID, inexistente, imutabilidade   |
| `filterTasks`    | 6      | Filtros: all, pending, completed, vazio       |
| `countTasks`     | 2      | Contagem total                                |
| `countCompleted` | 3      | Contagem de concluídas                        |
| `countPending`   | 3      | Contagem de pendentes                         |
| **Total**        | **46** |                                               |

---

## 13. Exercícios

### Exercícios em Aula

Agora é a sua vez! Implemente a função abaixo **seguindo o mesmo fluxo TDD** que praticamos juntos na seção 10. O professor está disponível para tirar dúvidas.

#### Exercício A: toggleTask (alternar conclusão)

**Função**: `toggleTask(task)` — recebe uma tarefa e retorna uma **nova tarefa** com `completed` invertido.

**Passo a passo**:

1. 🔴 Adicione `toggleTask` ao import em `tests/taskManager.test.js`
2. 🔴 Escreva os testes abaixo no arquivo de teste:
   - Tarefa pendente (`completed: false`) deve virar concluída (`completed: true`)
   - Tarefa concluída deve voltar a pendente
   - Deve manter `id` e `title` inalterados
   - Deve retornar um **novo objeto** (imutabilidade) — o original não muda
3. 🔴 Rode `npm test` → veja falhar → `git add tests/ && git commit -m "red: adiciona testes para toggleTask"`
4. 🟢 Implemente `toggleTask` em `src/taskManager.js`:
   ```javascript
   export function toggleTask(task) {
     return { ...task, completed: !task.completed };
   }
   ```
   > **`{ ...task, completed: !task.completed }`** — cria um **novo objeto** com todas as propriedades de `task` (via spread `...`), mas sobrescreve `completed` com o valor invertido. O objeto original não é modificado!
5. 🟢 Rode `npm test` → veja passar → `git add src/ && git commit -m "green: implementa toggleTask"`
6. `git push`

> **Dica**: Consulte a seção 12 para ver os testes completos de `toggleTask` se precisar de referência.

---

### Exercícios para Casa

As funções abaixo devem ser implementadas **seguindo o mesmo fluxo TDD com commits** praticado em aula. Para cada função:

1. 🔴 Escreva os testes → `git commit -m "red: ..."`
2. 🟢 Implemente o código → `git commit -m "green: ..."`
3. 🔵 Refatore (se aplicável) → `git commit -m "refactor: ..."`
4. `git push` após cada ciclo

#### Exercício 1: removeTask (remoção)

**Função**: `removeTask(tasks, taskId)` — remove uma tarefa pelo ID.

**O que testar**:
- Remove a tarefa correta pelo ID
- Mantém as outras tarefas intactas
- Retorna um **novo array** (imutabilidade)
- ID inexistente retorna a lista completa
- Lista vazia retorna array vazio

**Dica**: Use `tasks.filter(task => task.id !== taskId)`

---

#### Exercício 2: filterTasks (filtros)

**Função**: `filterTasks(tasks, status)` — filtra tarefas por status.

**O que testar**:
- Filtro `'all'` retorna todas
- Filtro `'pending'` retorna apenas pendentes
- Filtro `'completed'` retorna apenas concluídas
- Filtro desconhecido retorna todas (default)
- Lista vazia retorna array vazio
- Retorna um **novo array** (imutabilidade)

**Dica**: Use `switch` com `case 'completed'`, `case 'pending'`, `default`

---

#### Exercício 3: Contagens

**Funções**: `countTasks(tasks)`, `countCompleted(tasks)`, `countPending(tasks)`

**O que testar**:
- Lista vazia retorna 0 para todas
- `countTasks` retorna o total
- `countCompleted` conta apenas `completed === true`
- `countPending` conta apenas `completed === false`
- Retorna 0 quando não há nenhuma do tipo

---

#### Exercício 4: Adicionar prioridade às tarefas

**Objetivo**: Modificar a criação de tarefas para incluir um campo `priority`.

**O que implementar**:
- Modificar `createTask` para aceitar um segundo parâmetro `priority` (valores: `'low'`, `'medium'`, `'high'`)
- O padrão deve ser `'medium'` se não informado
- Criar `validatePriority(priority)` que retorna `true` apenas para os três valores válidos
- Criar `filterByPriority(tasks, priority)` que filtra por prioridade

**O que testar**:
- `createTask('Tarefa', 'high')` deve retornar objeto com `priority: 'high'`
- `createTask('Tarefa')` deve retornar `priority: 'medium'` (padrão)
- `validatePriority('high')` → `true`
- `validatePriority('urgente')` → `false`
- `filterByPriority(tasks, 'high')` deve retornar apenas tarefas de alta prioridade

---

#### Exercício 5: Impedir tarefas duplicadas

**Objetivo**: Não permitir duas tarefas com o **mesmo título** (case-insensitive).

**O que implementar**:
- Criar `isDuplicate(tasks, title)` que retorna `true` se já existe uma tarefa com o mesmo título (ignorando maiúsculas/minúsculas e espaços extras)
- Modificar `addTask` para verificar duplicatas antes de adicionar

**O que testar**:
- `isDuplicate([{ title: 'Estudar' }], 'Estudar')` → `true`
- `isDuplicate([{ title: 'Estudar' }], 'estudar')` → `true` (case-insensitive)
- `isDuplicate([{ title: 'Estudar' }], 'Trabalhar')` → `false`
- `addTask(tasks, 'Estudar')` quando já existe 'Estudar' → deve lançar erro

---

#### Exercício 6: Ordenar tarefas

**Objetivo**: Criar uma função que ordena tarefas — pendentes primeiro, depois concluídas.

**O que implementar**:
- Criar `sortTasks(tasks)` que retorna um novo array ordenado:
  - Primeiro as pendentes (`completed: false`)
  - Depois as concluídas (`completed: true`)
  - Dentro de cada grupo, manter a ordem original

**O que testar**:
- Lista mista deve retornar pendentes antes de concluídas
- Lista só com pendentes deve manter a ordem
- Lista só com concluídas deve manter a ordem
- Lista vazia deve retornar array vazio
- Deve retornar um NOVO array (imutabilidade)

---

#### Exercício 7: Busca por texto

**Objetivo**: Permitir buscar tarefas cujo título contenha um determinado texto.

**O que implementar**:
- Criar `searchTasks(tasks, query)` que retorna tarefas cujo título contém a `query` (case-insensitive)

**O que testar**:
- `searchTasks(tasks, 'est')` deve encontrar "Estudar" e "Testar"
- `searchTasks(tasks, 'EST')` deve funcionar (case-insensitive)
- `searchTasks(tasks, 'xyz')` deve retornar array vazio
- `searchTasks([], 'algo')` deve retornar array vazio
- `searchTasks(tasks, '')` deve retornar todas as tarefas

---

## 14. Boas Práticas

### 1. Nomes de testes descritivos

Use o padrão **"deve [ação] quando [condição]"**:

```javascript
// ✅ BOM — descreve o comportamento
it('deve retornar false quando o título é vazio', () => { ... });

// ❌ RUIM — não diz nada
it('teste 1', () => { ... });
it('funciona', () => { ... });
```

### 2. Independência entre testes

Cada teste deve funcionar **sozinho**, sem depender de outro:

```javascript
// ✅ BOM — cada teste cria seus próprios dados
beforeEach(() => {
  resetId();
});

// ❌ RUIM — um teste modifica dados que outro usa
let sharedTasks = []; // estado compartilhado mutável
```

### 3. Evitar duplicação com beforeEach

Se vários testes precisam do mesmo setup, use `beforeEach`:

```javascript
describe('removeTask', () => {
  let tasks;

  beforeEach(() => {
    resetId();
    tasks = addTask([], 'Tarefa 1');
    tasks = addTask(tasks, 'Tarefa 2');
  });

  it('deve remover a tarefa pelo ID', () => { ... });
  it('deve manter as outras intactas', () => { ... });
});
```

### 4. Evitar testes frágeis

Teste o **comportamento**, não a **implementação**:

```javascript
// ✅ BOM — testa o comportamento (o que ela retorna)
it('deve criar tarefa com completed false', () => {
  const task = createTask('Estudar');
  expect(task.completed).toBe(false);
});

// ❌ RUIM — testa implementação interna (como ela faz)
it('deve usar spread operator', () => {
  // Não teste como o código funciona internamente
});
```

### 5. Testar comportamento, não implementação

Pergunte-se: **"Se eu refatorar o código interno (sem mudar o que ele faz), o teste continua passando?"**

- Se **sim** → bom teste
- Se **não** → teste frágil — refatore o teste

### 6. Um conceito por teste

Cada `it()` deve verificar **uma coisa**:

```javascript
// ✅ BOM — um conceito
it('deve retornar true para título válido', () => {
  expect(validateTitle('Estudar')).toBe(true);
});

it('deve retornar false para string vazia', () => {
  expect(validateTitle('')).toBe(false);
});

// ❌ RUIM — muitos conceitos
it('deve validar títulos', () => {
  expect(validateTitle('Estudar')).toBe(true);
  expect(validateTitle('')).toBe(false);
  expect(validateTitle(null)).toBe(false);
  expect(validateTitle(123)).toBe(false);
});
```

---

## 15. Entrega

### O que entregar

O **link do repositório remoto** (GitHub) contendo:

1. Todo o código em `src/taskManager.js`
2. Todos os testes em `tests/taskManager.test.js`
3. Todos os testes passando (`npm test` sem erros)
4. Histórico de commits seguindo a convenção `red:` / `green:` / `refactor:`

### Como será avaliado

| Critério | O que o professor vai verificar |
|----------|---------------------------------|
| **Commits `red:`** | Alteram **apenas** arquivos em `tests/` |
| **Commits `green:`** | Alteram **apenas** arquivos em `src/` |
| **Ordem cronológica** | Cada `red:` vem **antes** do `green:` correspondente |
| **Testes passam** | `npm test` roda sem erros no commit final |
| **Exercícios** | Funções restantes implementadas com TDD |

### Como o professor verifica

```bash
# Clonar o repositório do aluno
git clone <URL-DO-ALUNO>
cd tdd-testes

# Ver histórico de commits
git log --oneline

# Instalar e rodar testes
npm install
npm test
```

---

## 16. Referências

1. **Vitest — Getting Started**: https://vitest.dev/guide/
2. **Vitest — API Reference**: https://vitest.dev/api/
3. **Vitest — Features**: https://vitest.dev/guide/features
4. **Node.js — Documentação oficial**: https://nodejs.org/en/docs
5. **Martin Fowler — The Practical Test Pyramid**: https://martinfowler.com/articles/practical-test-pyramid.html
6. **Kent Beck — Test-Driven Development: By Example** (Addison-Wesley, 2002)
7. **Robert C. Martin — Clean Code** (Prentice Hall, 2008) — Capítulo 9: Unit Tests