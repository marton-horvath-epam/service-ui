/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import { storiesOf } from '@storybook/react';
import { host } from 'storybook-host';
import { withReadme } from 'storybook-readme';
import { FieldErrorHint } from './fieldErrorHint';
import README from './README.md';

storiesOf('Components/Fields/InputErrorHint', module)
  .addDecorator(
    host({
      title: 'Field error hint',
      align: 'center middle',
      backdrop: 'rgba(70, 69, 71, 0.2)',
      background: '#ffffff',
      height: 42,
      width: 382,
    }),
  )
  .addDecorator(withReadme(README))
  .add('default state', () => <FieldErrorHint />)
  .add('with error message without focus', () => <FieldErrorHint error={'test error message'} />)
  .add('with error message & focus', () => <FieldErrorHint error={'test error message'} active />);
