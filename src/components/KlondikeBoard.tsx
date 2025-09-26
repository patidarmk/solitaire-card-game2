"use client";
import * as React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Crown, Undo, Redo, Lightbulb, Zap, Trophy, Card } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CardComponent } from './Card';
import { Card as CardType, createDeck, dealKlondike, getCardValue, isValidTableauMove, isValidFoundationMove, suits, hasValidMoves, isGameWon } from '@/data/cards';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface KlondikeState {
  stock: CardType[];
  waste: CardType[];
  tableau: CardType[][];
  foundations: CardType[][];
  score: number;
  moves: number;
  history: KlondikeState[];
  future: KlondikeState[];
  gameWon: boolean;
  gameLost: boolean;
  hint: { from: string; to: string; type: 'tableau' | 'foundation' } | null;
}

type Action =
  | { type: 'DRAW' }
  | { type: 'MOVE'; from: { pile: 'waste' | 'tableau'; pileIndex: number; cardIndex: number }; to: { pile: 'tableau' | 'foundation'; pileIndex: number }; cards: CardType[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'AUTO_COMPLETE' }
  | { type: 'HINT' }
  | { type: 'NEW_GAME'; seed?: number };

const initialState: KlondikeState = {
  stock: [],
  waste: [],
  tableau: [[], [], [], [], [], [], []],
  foundations: [[], [], [], []],
  score: 0,
  moves: 0,
  history: [],
  future: [],
  gameWon: false,
  gameLost: false,
  hint: null,
};

const deepCloneState = (state: KlondikeState): KlondikeState => ({
  ...state,
  stock: state.stock.map(c => ({ ...c })),
  waste: state.waste.map(c => ({ ...c })),
  tableau: state.tableau.map(col => col.map(c => ({ ...c }))),
  foundations: state.foundations.map(pile => pile.map(c => ({ ...c }))),
  history: state.history.map(deepCloneState),
  future: state.future.map(deepCloneState),
});

const klondikeReducer = (state: KlondikeState, action: Action): KlondikeState => {
  let newState = deepCloneState(state);

  switch (action.type) {
    case 'NEW_GAME':
      const deck = createDeck(action.seed);
      const dealt = dealKlondike(deck);
      newState = { ...initialState, ...dealt };
      newState.history = [];
      return newState;

    case 'DRAW':
      if (newState.stock.length > 0) {
        const card = { ...newState.stock.pop()! };
        card.faceUp = true;
        newState.waste.unshift(card);
        newState.score += 5;
      } else if (newState.waste.length > 0) {
        newState.stock = newState.waste.reverse().map(c => ({ ...c, faceUp: false }));
        newState.waste = [];
        newState.score -= 100;
      }
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'MOVE':
      const { from, to, cards } = action;
      let sourceCards = cards.map(c => ({ ...c }));
      if (from.pile === 'waste') {
        newState.waste = newState.waste.slice(sourceCards.length);
      } else {
        newState.tableau[from.pileIndex] = newState.tableau[from.pileIndex].filter((_, idx) => idx < from.cardIndex || idx >= from.cardIndex + sourceCards.length);
        if (newState.tableau[from.pileIndex].length > 0) {
          newState.tableau[from.pileIndex][newState.tableau[from.pileIndex].length - 1].faceUp = true;
        }
      }

      if (to.pile === 'tableau') {
        newState.tableau[to.pileIndex].push(...sourceCards);
        newState.score += 10 * sourceCards.length;
      } else {
        newState.foundations[to.pileIndex].push(...sourceCards);
        newState.score += 40 * sourceCards.length;
      }
      newState.moves++;
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'UNDO':
      if (newState.history.length > 0) {
        const prev = newState.history.pop()!;
        newState.future.unshift(deepCloneState(newState));
        newState = deepCloneState(prev);
        newState.score -= 15;
      }
      break;

    case 'REDO':
      if (newState.future.length > 0) {
        const next = newState.future.shift()!;
        newState.history.push(deepCloneState(newState));
        newState = deepCloneState(next);
      }
      break;

    case 'AUTO_COMPLETE':
      for (let i = 0; i < 4; i++) {
        if (newState.waste.length > 0) {
          const topWaste = newState.waste[0];
          const topFoundation = newState.foundations[i][newState.foundations[i].length - 1] || null;
          if (isValidFoundationMove(topWaste, topFoundation, suits[i])) {
            newState.foundations[i].push(newState.waste.shift()!);
            newState.score += 40;
          }
        }
      }
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'HINT':
      newState.hint = { from: 'waste-0', to: 'tableau-0', type: 'tableau' };
      break;
  }

  newState.gameWon = isGameWon(newState.foundations);
  newState.gameLost = !newState.gameWon && newState.stock.length === 0 && newState.waste.length === 0 && !hasValidMoves(newState);

  return newState;
};

const DraggableCard = ({ card, index, pileType, onMove }: { card: CardType; index: number; pileType: string; onMove: (cards: CardType[]) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card,<dyad-problem-report summary="108 problems">
<problem file="src/components/KlondikeBoard.tsx" line="153" column="31" code="1136">Property assignment expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="52" code="1005">')' expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="154" column="1" code="2657">JSX expressions must have one parent element.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="154" column="118" code="1005">'}' expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="154" column="177" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="156" column="120" code="1005">'}' expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="156" column="160" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="157" column="122" code="1005">'}' expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="157" column="162" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="1" code="1128">Declaration or statement expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="24" code="17008">JSX element 'applaa-write' has no corresponding closing tag.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="169" column="38" code="1005">'}' expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="169" column="63" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="171" column="18" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="172" column="3" code="1109">Expression expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="172" column="61" code="1005">'}' expected.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="172" column="74" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="174" column="31" code="1382">Unexpected token. Did you mean `{'&gt;'}` or `&amp;gt;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="258" column="1" code="1381">Unexpected token. Did you mean `{'}'}` or `&amp;rbrace;`?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="260" column="21" code="1005">'&lt;/' expected.</problem>
<problem file="src/pages/Home.tsx" line="33" column="12" code="2741">Property 'search' is missing in type '{ children: Element; to: &quot;/klondike/$&quot;; className: string; }' but required in type 'MakeRequiredSearchParams&lt;RouterCore&lt;Route&lt;Register, any, &quot;/&quot;, &quot;/&quot;, string, &quot;__root__&quot;, undefined, {}, {}, AnyContext, AnyContext, {}, undefined, readonly [Route&lt;unknown, RootRoute&lt;Register, ... 10 more ..., undefined&gt;, ... 15 more ..., undefined&gt;, ... 8 more ..., Route&lt;...&gt;], unknown, unknown, unknown, undefined&gt;, &quot;...'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="6" column="53" code="2724">'&quot;lucide-react&quot;' has no exported member named 'Card'. Did you mean 'Car'?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="24" code="2365">Operator '&lt;' cannot be applied to types '{ card: any; }' and 'number'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="26" code="2552">Cannot find name 'card'. Did you mean 'Card'?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="32" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="37" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="45" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="153" column="60" code="2365">Operator '&gt;' cannot be applied to types 'string' and 'Element'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="154" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="154" column="110" code="2304">Cannot find name 'children'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="154" column="589" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="155" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="155" column="154" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="156" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="156" column="112" code="2304">Cannot find name 'children'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="156" column="572" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="157" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="157" column="114" code="2304">Cannot find name 'children'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="157" column="574" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="158" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="158" column="98" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="159" column="1" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="159" column="98" code="2339">Property 'problem' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="3" code="2304">Cannot find name 'dyad'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="3" code="2365">Operator '&gt;' cannot be applied to types 'number' and 'Element'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="8" code="2304">Cannot find name 'problem'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="16" code="2552">Cannot find name 'report'. Did you mean 'Report'?</problem>
<problem file="src/components/KlondikeBoard.tsx" line="160" column="23" code="2339">Property 'applaa-write' does not exist on type 'JSX.IntrinsicElements'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="162" column="10" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="163" column="10" code="2304">Cannot find name 'z'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="16" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="29" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="46" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="164" column="58" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="166" column="10" code="2695">Left side of comma operator is unused and has no side effects.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="166" column="17" code="2304">Cannot find name 'Gamepad2'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="167" column="10" code="2304">Cannot find name 'useLocalStorage'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="169" column="33" code="2304">Cannot find name 'daily'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="172" column="56" code="2304">Cannot find name 'games'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="187" column="32" code="2304">Cannot find name 'winRate'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="187" column="44" code="2304">Cannot find name 'stats'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="187" column="57" code="2304">Cannot find name 'stats'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="193" column="12" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="195" column="16" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="196" column="18" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="197" column="20" code="2304">Cannot find name 'Gamepad2'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="199" column="19" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="200" column="18" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="200" column="89" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="201" column="17" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="202" column="16" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="204" column="17" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="206" column="13" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="208" column="12" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="210" column="16" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="211" column="18" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="212" column="20" code="2304">Cannot find name 'Gamepad2'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="214" column="19" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="215" column="18" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="215" column="72" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="216" column="17" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="217" column="16" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="219" column="17" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="221" column="13" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="223" column="12" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="225" column="16" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="226" column="18" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="227" column="20" code="2304">Cannot find name 'Gamepad2'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="229" column="19" code="2304">Cannot find name 'CardTitle'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="230" column="18" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="230" column="76" code="2304">Cannot find name 'CardDescription'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="231" column="17" code="2304">Cannot find name 'CardHeader'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="232" column="16" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="234" column="17" code="2304">Cannot find name 'CardContent'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="236" column="13" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="245" column="12" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="249" column="13" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="253" column="12" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/KlondikeBoard.tsx" line="253" column="88" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/components/GameBoard.tsx" line="6" column="8" code="1192">Module '&quot;C:/Users/win/applaa-workspace/apps/web/solitaire-card-game2/src/components/KlondikeBoard&quot;' has no default export.</problem>
<problem file="src/pages/Spider.tsx" line="40" column="16" code="2741">Property 'search' is missing in type '{ children: Element; to: &quot;/klondike/$&quot;; }' but required in type 'MakeRequiredSearchParams&lt;RouterCore&lt;Route&lt;Register, any, &quot;/&quot;, &quot;/&quot;, string, &quot;__root__&quot;, undefined, {}, {}, AnyContext, AnyContext, {}, undefined, readonly [Route&lt;unknown, RootRoute&lt;Register, ... 10 more ..., undefined&gt;, ... 15 more ..., undefined&gt;, ... 8 more ..., Route&lt;...&gt;], unknown, unknown, unknown, undefined&gt;, &quot;...'.</problem>
<problem file="src/pages/FreeCell.tsx" line="40" column="16" code="2741">Property 'search' is missing in type '{ children: Element; to: &quot;/klondike/$&quot;; }' but required in type 'MakeRequiredSearchParams&lt;RouterCore&lt;Route&lt;Register, any, &quot;/&quot;, &quot;/&quot;, string, &quot;__root__&quot;, undefined, {}, {}, AnyContext, AnyContext, {}, undefined, readonly [Route&lt;unknown, RootRoute&lt;Register, ... 10 more ..., undefined&gt;, ... 15 more ..., undefined&gt;, ... 8 more ..., Route&lt;...&gt;], unknown, unknown, unknown, undefined&gt;, &quot;...'.</problem>
<problem file="src/pages/NotFound.tsx" line="19" column="10" code="2304">Cannot find name 'Link'.</problem>
<problem file="src/pages/NotFound.tsx" line="21" column="11" code="2304">Cannot find name 'Link'.</problem>
</dyad-problem-report><applaa-write path="src/components/KlondikeBoard.tsx" description="Clean rewrite: Removed corrupted dyad tags, fixed syntax, used CreditCard icon, ensured proper component definitions and exports.">
"use client";
import * as React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Crown, Undo, Redo, Lightbulb, Zap, Trophy, CreditCard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CardComponent } from './Card';
import { Card as CardType, createDeck, dealKlondike, getCardValue, isValidTableauMove, isValidFoundationMove, suits, hasValidMoves, isGameWon } from '@/data/cards';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface KlondikeState {
  stock: CardType[];
  waste: CardType[];
  tableau: CardType[][];
  foundations: CardType[][];
  score: number;
  moves: number;
  history: KlondikeState[];
  future: KlondikeState[];
  gameWon: boolean;
  gameLost: boolean;
  hint: { from: string; to: string; type: 'tableau' | 'foundation' } | null;
}

type Action =
  | { type: 'DRAW' }
  | { type: 'MOVE'; from: { pile: 'waste' | 'tableau'; pileIndex: number; cardIndex: number }; to: { pile: 'tableau' | 'foundation'; pileIndex: number }; cards: CardType[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'AUTO_COMPLETE' }
  | { type: 'HINT' }
  | { type: 'NEW_GAME'; seed?: number };

const initialState: KlondikeState = {
  stock: [],
  waste: [],
  tableau: [[], [], [], [], [], [], []],
  foundations: [[], [], [], []],
  score: 0,
  moves: 0,
  history: [],
  future: [],
  gameWon: false,
  gameLost: false,
  hint: null,
};

const deepCloneState = (state: KlondikeState): KlondikeState => ({
  ...state,
  stock: state.stock.map(c => ({ ...c })),
  waste: state.waste.map(c => ({ ...c })),
  tableau: state.tableau.map(col => col.map(c => ({ ...c }))),
  foundations: state.foundations.map(pile => pile.map(c => ({ ...c }))),
  history: state.history.map(deepCloneState),
  future: state.future.map(deepCloneState),
});

const klondikeReducer = (state: KlondikeState, action: Action): KlondikeState => {
  let newState = deepCloneState(state);

  switch (action.type) {
    case 'NEW_GAME':
      const deck = createDeck(action.seed);
      const dealt = dealKlondike(deck);
      newState = { ...initialState, ...dealt };
      newState.history = [];
      return newState;

    case 'DRAW':
      if (newState.stock.length > 0) {
        const card = { ...newState.stock.pop()! };
        card.faceUp = true;
        newState.waste.unshift(card);
        newState.score += 5;
      } else if (newState.waste.length > 0) {
        newState.stock = newState.waste.reverse().map(c => ({ ...c, faceUp: false }));
        newState.waste = [];
        newState.score -= 100;
      }
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'MOVE':
      const { from, to, cards } = action;
      let sourceCards = cards.map(c => ({ ...c }));
      if (from.pile === 'waste') {
        newState.waste = newState.waste.slice(sourceCards.length);
      } else {
        newState.tableau[from.pileIndex] = newState.tableau[from.pileIndex].filter((_, idx) => idx < from.cardIndex || idx >= from.cardIndex + sourceCards.length);
        if (newState.tableau[from.pileIndex].length > 0) {
          newState.tableau[from.pileIndex][newState.tableau[from.pileIndex].length - 1].faceUp = true;
        }
      }

      if (to.pile === 'tableau') {
        newState.tableau[to.pileIndex].push(...sourceCards);
        newState.score += 10 * sourceCards.length;
      } else {
        newState.foundations[to.pileIndex].push(...sourceCards);
        newState.score += 40 * sourceCards.length;
      }
      newState.moves++;
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'UNDO':
      if (newState.history.length > 0) {
        const prev = newState.history.pop()!;
        newState.future.unshift(deepCloneState(newState));
        newState = deepCloneState(prev);
        newState.score -= 15;
      }
      break;

    case 'REDO':
      if (newState.future.length > 0) {
        const next = newState.future.shift()!;
        newState.history.push(deepCloneState(newState));
        newState = deepCloneState(next);
      }
      break;

    case 'AUTO_COMPLETE':
      for (let i = 0; i < 4; i++) {
        if (newState.waste.length > 0) {
          const topWaste = newState.waste[0];
          const topFoundation = newState.foundations[i][newState.foundations[i].length - 1] || null;
          if (isValidFoundationMove(topWaste, topFoundation, suits[i])) {
            newState.foundations[i].push(newState.waste.shift()!);
            newState.score += 40;
          }
        }
      }
      newState.history.push(deepCloneState(state));
      newState.future = [];
      break;

    case 'HINT':
      newState.hint = { from: 'waste-0', to: 'tableau-0', type: 'tableau' };
      break;
  }

  newState.gameWon = isGameWon(newState.foundations);
  newState.gameLost = !newState.gameWon && newState.stock.length === 0 && newState.waste.length === 0 && !hasValidMoves(newState);

  return newState;
};

const DraggableCard = ({ card, index, pileType, onMove }: { card: CardType; index: number; pileType: string; onMove: (cards: CardType[]) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { card, index, pileType },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ pileIndex: number; pileType: string }>();
      if (dropResult && item.card) {
        const movableCards = [item.card];
        onMove(movableCards);
      }
    },
  }), [card, index, pileType, onMove]);

  return <CardComponent card={card} isDragging={isDragging} ref={drag as any} />;
};

const DroppablePile = ({ pile, pileIndex, pileType, onDrop }: { pile: CardType[]; pileIndex: number; pileType: 'tableau' | 'foundation' | 'waste'; onDrop: (cards: CardType[], pileIndex: number, pileType: string) => void }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'card',
    drop: (item: { card: CardType; index: number; pileType: string }) => {
      const movableCards = [item.card];
      onDrop(movableCards, pileIndex, pileType);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }), [pileIndex, pileType, onDrop]);

  return (
    <motion.div ref={drop} className={cn("flex flex-col space-y-[-8px] p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md", isOver && 'ring-2 ring-blue-500')}>
      <AnimatePresence>
        {pile.map((card, i) => (
          <DraggableCard key={card.id} card={card} index={i} pileType={pileType} onMove={() => {}} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const KlondikeBoardInner: React.FC<{ seed?: number }> = ({ seed }) => {
  const [state, dispatch] = React.useReducer(klondikeReducer, initialState);
  const { toast } = useToast();

  React.useEffect(() => {
    dispatch({ type: 'NEW_GAME', seed: seed || Date.now() });
  }, [seed]);

  React.useEffect(() => {
    if (state.gameWon) {
      const stats = JSON.parse(localStorage.getItem('solitaire-stats') || '{}');
      stats.games = (stats.games || 0) + 1;
      stats.wins = (stats.wins || 0) + 1;
      localStorage.setItem('solitaire-stats', JSON.stringify(stats));
      toast({ title: 'Congratulations! You won!', description: `Score: ${state.score}` });
    }
  }, [state.gameWon, state.score, toast]);

  const handleDraw = () => dispatch({ type: 'DRAW' });
  const handleMove = (cards: CardType[], toPileIndex: number, toPileType: string) => {
    const pileType = toPileType as 'tableau' | 'foundation';
    dispatch({ type: 'MOVE', from: { pile: 'tableau' as const, pileIndex: 0, cardIndex: 0 }, to: { pile: pileType, pileIndex: toPileIndex }, cards });
  };
  const handleUndo = () => dispatch({ type: 'UNDO' });
  const handleRedo = () => dispatch({ type: 'REDO' });
  const handleAutoComplete = () => dispatch({ type: 'AUTO_COMPLETE' });
  const handleHint = () => dispatch({ type: 'HINT' });
  const handleNewGame = () => dispatch({ type: 'NEW_GAME' });

  if (state.gameWon) {
    return (
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white/90 p-8 rounded-lg shadow-xl">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Victory!</h2>
          <p>Score: {state.score} | Moves: {state.moves}</p>
          <Button onClick={handleNewGame} className="mt-4">New Game</Button>
        </div>
      </motion.div>
    );
  }

  if (state.gameLost) {
    return (
      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-white/90 p-8 rounded-lg shadow-xl">
          <CreditCard className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p>No more moves!</p>
          <Button onClick={handleNewGame} className="mt-4">New Game</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex space-x-4">
          <Button variant="outline" onClick={handleUndo} disabled={state.history.length === 0}><Undo className="w-4 h-4 mr-2" />Undo</Button>
          <Button variant="outline" onClick={handleRedo} disabled={state.future.length === 0}><Redo className="w-4 h-4 mr-2" />Redo</Button>
          <Button variant="outline" onClick={handleHint}><Lightbulb className="w-4 h-4 mr-2" />Hint</Button>
          <Button onClick={handleAutoComplete}><Zap className="w-4 h-4 mr-2" />Auto-Complete</Button>
        </div>
        <div className="text-2xl font-bold">Score: {state.score} | Moves: {state.moves}</div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="flex justify-center space-x-4 mb-8">
          <div className="w-16 h-24 bg-blue-200 rounded cursor-pointer" onClick={handleDraw}>Draw</div>
          <DroppablePile pile={state.waste.slice(-1)} pileIndex={0} pileType="waste" onDrop={handleMove} />
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          {state.tableau.map((pile, i) => (
            <DroppablePile key={i} pile={pile} pileIndex={i} pileType="tableau" onDrop={handleMove} />
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          {state.foundations.map((pile, i) => (
            <DroppablePile key={i} pile={pile.slice(-1)} pileIndex={i} pileType="foundation" onDrop={handleMove} />
          ))}
        </div>
      </DndProvider>

      {state.hint && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded">
          Hint: Move from {state.hint.from} to {state.hint.to}
        </motion.div>
      )}
    </div>
  );
};

const KlondikeBoard = () => <KlondikeBoardInner seed={undefined} />;

export default KlondikeBoard;